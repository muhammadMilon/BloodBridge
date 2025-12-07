import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import useAxiosPublic from "../hooks/axiosPublic";

const Search = () => {
  const axiosPublic = useAxiosPublic();
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [donorHistory, setDonorHistory] = useState({});

  const [formData, setFormData] = useState({
    bloodGroup: "",
    district: "",
    districtId: "",
    upazila: "",
    availability: "",
  });

  // Load districts and upazilas
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [districtRes, upazilaRes] = await Promise.all([
                axios.get("/districts.json"),
                axios.get("/upazilas.json"),
            ]);
            setDistricts(districtRes.data);
            setUpazilas(upazilaRes.data);
        } catch (error) {
            console.error("Failed to load location data", error);
        }
    };
    fetchData();
  }, []);

  useEffect(() => {
    axiosPublic
      .get("/donor-history")
      .then(({ data }) => {
        const mapping = {};
        data.forEach((item) => {
          mapping[item._id] = item;
        });
        setDonorHistory(mapping);
      })
      .catch(() => {
        setDonorHistory({});
      });
  }, [axiosPublic]);

  // Update filtered upazilas based on district selection
  useEffect(() => {
    if (formData.districtId) {
      const filtered = upazilas.filter(
        (u) => u.district_id === formData.districtId
      );
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  }, [formData.districtId, upazilas]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When district changes, update both name & id
    if (name === "district") {
      const selectedDistrict = districts.find((d) => d.name === value);
      setFormData((prev) => ({
        ...prev,
        district: value,
        districtId: selectedDistrict ? selectedDistrict.id : "",
        upazila: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosPublic.get("/get-donors");
      const allDonors = res.data;
      setDonors(allDonors);

      // Filter based on formData
      const filtered = allDonors.filter((donor) => {
        return (
          donor.role === "donor" &&
          donor.status === "active" &&
          (formData.bloodGroup
            ? donor.bloodGroup === formData.bloodGroup
            : true) &&
          (formData.district ? donor.district === formData.district : true) &&
          (formData.upazila ? donor.upazila === formData.upazila : true) &&
          (formData.availability
            ? donor.availabilityStatus === formData.availability
            : true)
        );
      });

      setSearchResult(filtered);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const badgeForDonations = (count = 0) => {
    if (count >= 5) return { label: "Gold", color: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" };
    if (count >= 3) return { label: "Silver", color: "bg-slate-500/20 text-slate-300 border border-slate-500/30" };
    if (count >= 1) return { label: "Bronze", color: "bg-orange-500/20 text-orange-400 border border-orange-500/30" };
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 relative overflow-hidden">
      <PageTitle title={"Search"} />
    
        {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-900/10 rounded-full blur-3xl" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-3xl" />
      </div>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
        <div className="text-center mb-12">
            <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
                <span className="text-gray-100">Find a </span>
                <span className="bg-gradient-to-r from-rose-500 to-red-500 bg-clip-text text-transparent">
                  Blood Donor
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Connect with local donors available in your area precisely when you need them.
              </p>
          </motion.div>
        </div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSearch}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 mb-16 max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Blood Group */}
            <div className="relative group">
                <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full bg-slate-800 border-slate-700 text-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-slate-750"
                >
                <option value="" className="bg-slate-800 text-gray-400">Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                </select>
            </div>

            {/* District */}
            <div className="relative">
                <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full bg-slate-800 border-slate-700 text-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-slate-750"
                >
                <option value="" className="bg-slate-800 text-gray-400">District</option>
                {districts.map((district) => (
                    <option key={district.id} value={district.name}>
                    {district.name}
                    </option>
                ))}
                </select>
            </div>

            {/* Upazila */}
            <div className="relative">
                <select
                name="upazila"
                value={formData.upazila}
                onChange={handleChange}
                className="w-full bg-slate-800 border-slate-700 text-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-slate-750 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!filteredUpazilas.length}
                >
                <option value="" className="bg-slate-800 text-gray-400">Upazila</option>
                {filteredUpazilas.map((u) => (
                    <option key={u.id} value={u.name}>
                    {u.name}
                    </option>
                ))}
                </select>
            </div>

            {/* Availability */}
            <div className="relative">
                <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full bg-slate-800 border-slate-700 text-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer hover:bg-slate-750"
                >
                <option value="" className="bg-slate-800 text-gray-400">Availability</option>
                <option value="available">Available Now</option>
                <option value="resting">Resting</option>
                <option value="medical-review">Medical Review</option>
                </select>
            </div>

             {/* Search Button */}
             <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-600 rounded-xl px-6 py-3 font-bold shadow-lg shadow-rose-900/20 hover:shadow-rose-500/40 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                Search
            </button>
          </div>
        </motion.form>

        {/* Search Result */}
        {searchResult.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResult.map((donor, index) => {
              const history = donorHistory[donor.email] || {};
              const badge = badgeForDonations(history.totalDonations);
              const verified = history.totalDonations > 0;
              return (
              <motion.div
                key={donor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-rose-500/50 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-rose-900/10 overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="relative inline-block mb-4">
                    <img
                      src={donor.image}
                      alt={donor.name}
                      className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-slate-800 shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:border-rose-500/30"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-rose-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-slate-900">
                      {donor.bloodGroup}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-100 line-clamp-1 group-hover:text-rose-400 transition-colors">
                      {donor.name}
                    </h3>
                    {verified && (
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs" title="Verified Donor">
                         ✓
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1 text-sm text-gray-400 mb-3">
                    <span className="line-clamp-1">
                       {donor.upazila}, {donor.district}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500 mb-4">
                    <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700 capitalize text-gray-300">
                      {donor.availabilityStatus || "available"}
                    </span>
                    {badge && (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1 text-xs text-rose-400/80 break-all p-2 bg-rose-500/5 rounded-lg border border-rose-500/10 hover:bg-rose-500/10 transition-colors cursor-pointer">
                    <span className="line-clamp-1">{donor.email}</span>
                  </div>
                </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
             donors.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <p className="text-gray-500 text-lg">No donors found matching your criteria.</p>
                </motion.div>
             )
        )}
        
        {/* Empty State / Initial State Animations */}
        {searchResult.length === 0 && (
            <div className="flex justify-center items-center py-20 relative h-64">
                 <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-8xl absolute"
                    style={{ opacity: 0.2, filter: 'blur(2px)' }}
                 >
                    🩸
                 </motion.div>
                 
                  <motion.div
                    animate={{ x: [-50, 50, -50], y: [20, -20, 20] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="text-6xl absolute top-10 left-1/4 opacity-10"
                 >
                    🔍
                 </motion.div>

                  <motion.div
                    animate={{ x: [50, -50, 50], y: [-20, 20, -20] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
                    className="text-6xl absolute bottom-10 right-1/4 opacity-10"
                 >
                    🏥
                 </motion.div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Search;
