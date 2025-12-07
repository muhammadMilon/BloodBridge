import { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import Loader from "../../components/Loader";
import PageTitle from "../../components/PageTitle";
import WelcomeMsg from "../../components/WelcomeMsg";
import useAxiosPublic from "../../hooks/axiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AuthContext } from "../../providers/AuthProvider";
import useRole from "../../hooks/useRole";

const ReceiverDashboard = () => {
  const { user } = useContext(AuthContext);
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get("/my-donation-request")
      .then(({ data }) => {
        const sorted = (data || []).sort(
          (a, b) => new Date(b.donationDate) - new Date(a.donationDate)
        );
        setRequests(sorted);
      })
      .catch((err) => {
        console.error("Error fetching receiver requests:", err);
      })
      .finally(() => setLoading(false));
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
              setRequests((prev) => prev.filter((req) => req._id !== id));
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

  const totalRequests = requests.length;
  const pending = requests.filter(
    (r) => String(r.donationStatus).toLowerCase() === "pending"
  ).length;
  const inProgress = requests.filter(
    (r) => String(r.donationStatus).toLowerCase() === "inprogress"
  ).length;
  const done = requests.filter(
    (r) => String(r.donationStatus).toLowerCase() === "done"
  ).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageTitle title={"Recipient Dashboard"} />
      <WelcomeMsg />

      {/* Recipient profile summary */}
      {user && (
        <div className="glass border border-rose-100 rounded-2xl p-4 mt-4 flex flex-col sm:flex-row items-center gap-4">
          <img
            src={
              user.image ||
              user.photoURL ||
              "https://via.placeholder.com/96?text=No+Image"
            }
            alt={user.name || user.displayName || "Recipient"}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900">
              {user.name || user.displayName || "Recipient"}
            </h3>
            <p className="text-sm text-slate-600">{user.email}</p>
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold">
                Blood Group: {user.bloodGroup || "Not set"}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-700">
                Location:{" "}
                {user.upazila && user.district
                  ? `${user.upazila}, ${user.district}`
                  : "Not set"}
              </span>
            </div>
            <Link
              to="/dashboard/profile"
              className="inline-flex items-center gap-2 text-rose-600 text-sm font-semibold mt-2 hover:text-rose-700 transition-colors"
            >
              Edit profile & update photo →
            </Link>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="glass border border-rose-100 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-rose-500 font-semibold">
            Total Requests
          </p>
          <h3 className="text-3xl font-black text-slate-900">
            {totalRequests}
          </h3>
        </div>
        <div className="glass border border-amber-100 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-500 font-semibold">
            Pending
          </p>
          <h3 className="text-3xl font-black text-slate-900">{pending}</h3>
        </div>
        <div className="glass border border-sky-100 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-sky-500 font-semibold">
            In Progress
          </p>
          <h3 className="text-3xl font-black text-slate-900">{inProgress}</h3>
        </div>
        <div className="glass border border-emerald-100 rounded-2xl p-4">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-500 font-semibold">
            Completed
          </p>
          <h3 className="text-3xl font-black text-slate-900">{done}</h3>
        </div>
      </div>

      {/* Requests table */}
      {loading && <Loader label="Loading your requests..." />}

      {!loading && requests.length > 0 && (
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
                {requests.map((item) => (
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
                      <Link
                        to={`/details/${item._id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        View
                      </Link>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="glass p-12 rounded-2xl text-center mt-8">
          <div className="text-6xl mb-4">🩸</div>
          <p className="text-text text-lg">
            You haven&apos;t created any blood requests yet.
          </p>
          <div className="mt-4">
            <Link
              to="/dashboard/create-donation-request"
              className="inline-block px-8 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Create Your First Request
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiverDashboard;


