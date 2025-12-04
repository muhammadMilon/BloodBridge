import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosPublic from "../hooks/axiosPublic";
import Title from "./Title";
import Loader from "./Loader";

export default function PendingRequests() {
  const axiosPublic = useAxiosPublic();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    axiosPublic
      .get("/all-donation-requests-public")
      .then((res) => {
        if (!isMounted) return;
        const data = Array.isArray(res.data) ? res.data : [];
        const pendingOnly = data.filter(
          (d) => String(d.donationStatus).toLowerCase() === "pending"
        );
        setItems(pendingOnly.slice(0, 6));
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Failed to load pending requests.");
      })
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
          Urgent Pending Requests
        </h2>
        <p className="text-slate-600 text-lg">
          These patients are waiting for your help.
        </p>
      </div>

      {loading ? (
        <Loader label="Loading requests..." />
      ) : error ? (
        <div className="text-center text-highlighted">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center opacity-70 text-text">
          No pending requests right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <article
              key={item._id}
              className="glass p-6 rounded-2xl hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">
                  {item.recipientName}
                </h3>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold shadow-md">
                    {item.bloodGroup}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      item.urgencyLevel === "critical"
                        ? "bg-red-100 text-red-600"
                        : item.urgencyLevel === "urgent"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {item.urgencyLevel || "urgent"}
                  </span>
                </div>
              </div>
              <div className="text-sm text-slate-600 space-y-2">
                <p className="flex items-start">
                  <span className="font-semibold text-slate-700 mr-2">📍</span>
                  <span>
                    {item.recipientDistrict}, {item.recipientUpazila}
                  </span>
                </p>
                <p className="flex items-start">
                  <span className="font-semibold text-slate-700 mr-2">🕒</span>
                  <span>
                    {item.donationDate} at {item.donationTime}
                  </span>
                </p>
                <p className="flex items-start capitalize">
                  <span className="font-semibold text-slate-700 mr-2">📋</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs">
                    {item.donationStatus}
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  Units needed: {item.unitsNeeded || 1} •{" "}
                  {item.needsAmbulance ? "Ambulance on standby" : "No ambulance needed"}
                </p>
              </div>

              <div className="mt-5">
                <Link
                  to={`/details/${item._id}`}
                  className="block text-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          to="/request"
          className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-rose-600 text-rose-600 hover:bg-rose-50 font-semibold transition-all transform hover:scale-105"
        >
          Browse All Requests
        </Link>
      </div>
    </section>
  );
}
