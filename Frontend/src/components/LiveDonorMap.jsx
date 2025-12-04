import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useAxiosPublic from "../hooks/axiosPublic";
import Loader from "./Loader";

const defaultPosition = { lat: 23.8103, lng: 90.4125 }; // Dhaka, Bangladesh

// Fix default Leaflet icon path in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LiveDonorMap = () => {
  const axiosPublic = useAxiosPublic();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodGroup, setBloodGroup] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [districtCoordinates, setDistrictCoordinates] = useState({});

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [donorRes, districtRes] = await Promise.all([
          axiosPublic.get("/get-donors"),
          fetch("/districts.json").then((res) => res.json()),
        ]);
        if (!isMounted) return;
        setDonors(donorRes.data || []);
        const coords = {};
        districtRes.forEach((d) => {
          coords[d.name] = { lat: parseFloat(d.lat), lng: parseFloat(d.lon) };
        });
        setDistrictCoordinates(coords);
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load donors for map", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [axiosPublic]);

  const markers = useMemo(() => {
    return donors
      .filter((donor) => donor.status === "active")
      .filter((donor) => (bloodGroup === "All" ? true : donor.bloodGroup === bloodGroup))
      .filter((donor) =>
        availability === "All" ? true : donor.availabilityStatus === availability
      )
      .map((donor) => {
        const geo = donor.geoLocation || districtCoordinates[donor.district];
        return {
          ...donor,
          coords: geo || defaultPosition,
        };
      });
  }, [donors, bloodGroup, availability, districtCoordinates]);

  if (loading) {
    return <Loader label="Rendering live donor map..." />;
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-rose-500 font-semibold">
            Live Donor Map
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Real-time Donor Availability by Location
          </h2>
          <p className="text-slate-600 max-w-2xl">
            Bubble size reflects donation recency; color indicates blood group. Toggle filters to focus on the donors you need now.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="px-4 py-3 border border-rose-200 rounded-xl font-semibold text-sm bg-white"
          >
            {["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((group) => (
              <option key={group} value={group}>
                {group === "All" ? "All Blood Groups" : group}
              </option>
            ))}
          </select>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="px-4 py-3 border border-rose-200 rounded-xl font-semibold text-sm bg-white"
          >
            {["All", "available", "resting", "medical-review"].map((value) => (
              <option key={value} value={value}>
                {value === "All" ? "All Status" : value.replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden border border-rose-100 shadow-2xl h-[480px]">
        <MapContainer
          center={defaultPosition}
          zoom={6}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker) => (
            <CircleMarker
              key={marker.email}
              center={marker.coords}
              pathOptions={{
                color: "#e11d48",
                fillColor: marker.bloodGroup?.includes("+") ? "#ef4444" : "#0ea5e9",
                fillOpacity: 0.6,
              }}
              radius={marker.lastDonationDate ? 8 : 5}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-bold text-slate-900">{marker.name}</p>
                  <p className="text-rose-600 font-semibold">{marker.bloodGroup}</p>
                  <p className="text-xs text-slate-500">
                    {marker.upazila}, {marker.district}
                  </p>
                  <p className="text-xs">
                    Status: <strong>{marker.availabilityStatus || "available"}</strong>
                  </p>
                  {marker.lastDonationDate && (
                    <p className="text-xs">Last donation: {marker.lastDonationDate}</p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
};

export default LiveDonorMap;

