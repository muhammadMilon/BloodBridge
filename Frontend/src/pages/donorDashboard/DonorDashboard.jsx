import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import PageTitle from "../../components/PageTitle";
import WelcomeMsg from "../../components/WelcomeMsg";
import useAxiosPublic from "../../hooks/axiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../providers/AuthProvider";

export default function DonorDashboard() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationHistory, setDonationHistory] = useState([]);
  const currentUser = user;

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get("/my-donation-request")
        .then((res) => {
          const sorted = res.data
            .sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate))
            .slice(0, 3);
          setDonationRequests(sorted);
        })
        .catch((err) => {
          console.error("Error fetching donation requests:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/donor-history/${user.email}`)
        .then((res) => setDonationHistory(res.data || []))
        .catch(() => setDonationHistory([]));
    }
  }, [axiosSecure, user]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic
          .delete(`/delete-request/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              setDonationRequests((prev) =>
                prev.filter((req) => req._id !== id)
              );
              Swal.fire(
                "Deleted!",
                "Your request has been deleted.",
                "success"
              );
            } else {
              Swal.fire(
                "Error",
                "Request not found or already deleted.",
                "error"
              );
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire("Error", "Something went wrong.", "error");
          });
      }
    });
  };

  const totalDonations = donationHistory.length;
  const badge =
    totalDonations >= 5
      ? "Gold"
      : totalDonations >= 3
      ? "Silver"
      : totalDonations >= 1
      ? "Bronze"
      : "New Donor";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <PageTitle title={"Donor Dashboard"} />
      <WelcomeMsg />

      {/* Donor profile summary */}
      {currentUser && (
        <div className="glass border border-rose-100/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-red-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <img
              src={
                currentUser.image ||
                currentUser.photoURL ||
                "https://via.placeholder.com/96?text=No+Image"
              }
              alt={currentUser.name || currentUser.displayName || "Donor"}
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {currentUser.name || currentUser.displayName || "Donor"}
            </h3>
            <p className="text-slate-600 font-medium">{currentUser.email}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className="px-4 py-1.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-100 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Blood: {currentUser.bloodGroup || "Not set"}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-700 font-medium border border-slate-100 shadow-sm">
                📍 {currentUser.upazila && currentUser.district
                  ? `${currentUser.upazila}, ${currentUser.district}`
                  : "Location not set"}
              </span>
            </div>
            
            <div className="pt-2">
              <Link
                to="/dashboard/profile"
                className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold transition-colors group"
              >
                Edit profile & update photo 
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass border border-rose-100/50 rounded-2xl p-6 h-full flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-rose-500 font-bold mb-2">
              Reward Progress
            </p>
            <h3 className="text-3xl font-black text-slate-900 mb-1">{badge}</h3>
            <p className="text-slate-500 font-medium">
              {totalDonations} verified donation{totalDonations === 1 ? "" : "s"}
            </p>
          </div>
          <div className="mt-6">
            <div className="h-3 bg-rose-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.min((totalDonations / 5) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-right mt-2 text-rose-400 font-medium">
              {5 - Math.min(totalDonations, 5)} more for next tier
            </p>
          </div>
        </div>

        <div className="glass border border-rose-100/50 rounded-2xl p-6 h-full flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-rose-500 font-bold mb-4">
              Reminder Settings
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                <span className="text-slate-600 font-medium">Email</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  currentUser?.reminderPreferences?.email 
                    ? "bg-green-100 text-green-700" 
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {currentUser?.reminderPreferences?.email ? "ON" : "OFF"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                <span className="text-slate-600 font-medium">SMS</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  currentUser?.reminderPreferences?.sms 
                    ? "bg-green-100 text-green-700" 
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {currentUser?.reminderPreferences?.sms ? "ON" : "OFF"}
                </span>
              </div>
            </div>
          </div>
          <Link
            to="/dashboard/profile"
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold mt-4 group"
          >
            Update preferences 
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="glass border border-rose-100/50 rounded-2xl p-6 h-full flex flex-col hover:scale-[1.02] transition-transform duration-300">
          <p className="text-xs uppercase tracking-[0.25em] text-rose-500 font-bold mb-3">
            Next Eligibility
          </p>
          <div className="flex-1 flex flex-col justify-center items-center text-center p-4 bg-rose-50/50 rounded-xl border border-rose-100/50 dashed">
            <span className="text-4xl mb-2">📅</span>
            <p className="text-slate-700 font-medium leading-relaxed">
              ~90 days after your last donation
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Keep your donation history updated for accurate tracking
            </p>
          </div>
        </div>
      </div>

      {/* Donation Requests Table */}
      {loading && <Loader label="Loading your latest requests..." />}
      
      {!loading && donationRequests.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden shadow-xl border border-rose-100/50">
          <div className="p-6 border-b border-rose-100 bg-white/30 backdrop-blur-sm flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-800">Recent Requests</h3>
            <Link 
              to="/dashboard/my-donation-requests" 
              className="text-sm font-semibold text-rose-600 hover:text-rose-700 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-rose-50/50 border-b border-rose-100">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider">Recipient</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-600 uppercase text-xs tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-center font-bold text-slate-600 uppercase text-xs tracking-wider">Blood</th>
                  <th className="px-6 py-4 text-center font-bold text-slate-600 uppercase text-xs tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right font-bold text-slate-600 uppercase text-xs tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {donationRequests.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-rose-50/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{item.recipientName}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.recipientDistrict}, {item.recipientUpazila}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{item.donationDate}</span>
                        <span className="text-xs">{item.donationTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-xs ring-2 ring-white">
                        {item.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        item.donationStatus === 'done' ? 'bg-green-100 text-green-800' :
                        item.donationStatus === 'canceled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.donationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link
                        to={`/dashboard/update-donation-request/${item._id}`}
                        className="text-slate-400 hover:text-indigo-600 transition-colors font-medium"
                        title="Edit"
                      >
                        ✎
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-slate-400 hover:text-red-600 transition-colors font-medium"
                        title="Delete"
                      >
                        🗑
                      </button>
                      <Link
                        to={`/details/${item._id}`}
                        className="inline-flex items-center justify-center px-3 py-1 rounded-md bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No requests */}
      {!loading && donationRequests.length === 0 && (
        <div className="glass p-12 rounded-2xl text-center border-2 border-dashed border-rose-200 bg-rose-50/20">
          <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">🩸</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Requests Yet</h3>
          <p className="text-slate-600 max-w-md mx-auto mb-8">
            You haven't created any donation requests. Start by creating one to track your blood donation journey.
          </p>
          <Link
             to="/dashboard/create-donation-request"
             className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
           Create Request
          </Link>
        </div>
      )}

      {/* View All Requests Button - Footer Style */}
      {!loading && donationRequests.length > 0 && (
        <div className="flex justify-center pt-4">
          <Link
            to="/dashboard/my-donation-requests"
            className="group inline-flex items-center gap-2 px-8 py-3 bg-white border border-rose-200 hover:border-rose-300 text-rose-600 hover:text-rose-700 font-bold rounded-full shadow-sm hover:shadow-md transition-all duration-300"
          >
            View All History
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
