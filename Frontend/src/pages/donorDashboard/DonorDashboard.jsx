import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import WelcomeMsg from "../../components/WelcomeMsg";
import Swal from "sweetalert2";
import useAxiosPublic from "../../hooks/axiosPublic";
import PageTitle from "../../components/PageTitle";
import useCurrentUser from "../../hooks/useCurrentUser";

export default function DonorDashboard({ user }) {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [donationRequests, setDonationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationHistory, setDonationHistory] = useState([]);
  const { currentUser } = useCurrentUser();

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
    <div className="p-4 sm:p-6 lg:p-8">
      <PageTitle title={"Donor Dashboard"} />
      {/* Welcome Message */}
      <WelcomeMsg />

      {/* Donor profile summary from registration data */}
      {currentUser && (
        <div className="glass border border-rose-100 rounded-2xl p-4 mt-4 flex flex-col sm:flex-row items-center gap-4">
          <img
            src={
              currentUser.image ||
              currentUser.photoURL ||
              "https://via.placeholder.com/96?text=No+Image"
            }
            alt={currentUser.name || currentUser.displayName || "Donor"}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              {currentUser.name || currentUser.displayName || "Donor"}
            </h3>
            <p className="text-sm text-slate-600">{currentUser.email}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold">
                Blood: {currentUser.bloodGroup || "Not set"}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-700">
                Location:{" "}
                {currentUser.upazila && currentUser.district
                  ? `${currentUser.upazila}, ${currentUser.district}`
                  : "Not set"}
              </span>
            </div>
            <Link
              to="/dashboard/profile"
              className="inline-flex items-center gap-2 text-rose-600 text-sm font-semibold mt-2"
            >
              Edit profile & update photo →
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="glass border border-rose-100 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-rose-500 font-semibold">
            Reward Progress
          </p>
          <h3 className="text-3xl font-black text-slate-900">{badge} badge</h3>
          <p className="text-sm text-slate-500">
            {totalDonations} verified donation{totalDonations === 1 ? "" : "s"}
          </p>
          <div className="mt-3 h-2 bg-rose-100 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-rose-600 to-red-600 rounded-full"
              style={{
                width: `${Math.min((totalDonations / 5) * 100, 100)}%`,
              }}
            ></div>
          </div>
        </div>
        <div className="glass border border-rose-100 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-rose-500 font-semibold">
            Reminder Preferences
          </p>
          <p className="text-sm text-slate-600">
            Email:{" "}
            <strong>
              {currentUser?.reminderPreferences?.email ? "Enabled" : "Disabled"}
            </strong>
          </p>
          <p className="text-sm text-slate-600">
            SMS:{" "}
            <strong>
              {currentUser?.reminderPreferences?.sms ? "Enabled" : "Disabled"}
            </strong>
          </p>
          <Link
            to="/dashboard/profile"
            className="inline-flex items-center gap-2 text-rose-600 text-sm font-semibold mt-2"
          >
            Update preferences →
          </Link>
        </div>
        <div className="glass border border-rose-100 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-rose-500 font-semibold">
            Next Reminder
          </p>
          <p className="text-sm text-slate-600">
            We will remind you roughly 90 days after your last donation. Keep your profile updated for accurate reminders.
          </p>
        </div>
      </div>

      {/* Donation Requests Table */}
      {loading && <Loader label="Loading your latest requests..." />}
      {!loading && donationRequests.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden shadow-2xl border border-rose-200 mt-8">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-rose-50 to-red-50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Recipient
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Blood
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {donationRequests.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-rose-100 hover:bg-rose-50 transition-colors text-text"
                  >
                    <td className="px-4 py-2">{item.recipientName}</td>
                    <td className="px-4 py-2">
                      {item.recipientDistrict}, {item.recipientUpazila}
                    </td>
                    <td className="px-4 py-2">{item.donationDate}</td>
                    <td className="px-4 py-2">{item.donationTime}</td>
                    <td className="px-4 py-2 font-semibold text-red-600">
                      {item.bloodGroup}
                    </td>
                    <td className="px-4 py-2 capitalize">
                      {item.donationStatus}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      {item.donationStatus === "inprogress" && (
                        <>
                          <button className="text-green-600 hover:underline">
                            Done
                          </button>
                          <button className="text-red-600 hover:underline">
                            Cancel
                          </button>
                        </>
                      )}
                      <Link
                        to={`/dashboard/update-donation-request/${item._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                      <Link
                        to={`/details/${item._id}`}
                        className="text-indigo-600 hover:underline"
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
        <div className="glass p-12 rounded-2xl text-center mt-8">
          <div className="text-6xl mb-4">🩸</div>
          <p className="text-text text-lg">
            You have not created any donation requests yet.
          </p>
        </div>
      )}

      {/* View All Requests Button */}
      {!loading && donationRequests.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            to="/dashboard/my-donation-requests"
            className="inline-block px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            View All My Requests
          </Link>
        </div>
      )}
    </div>
  );
}
