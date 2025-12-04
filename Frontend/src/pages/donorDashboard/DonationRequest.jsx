import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosPublic from "../../hooks/axiosPublic";
import PageTitle from "../../components/PageTitle";
import Loader from "../../components/Loader";

export default function DonationRequest() {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!user) return;

    axiosSecure
      .get("/my-donation-request")
      .then(async (res) => {
        const donations = res.data;
        setDonations(donations);

        const donorData = {};
        await Promise.all(
          donations.map(async (donation) => {
            try {
              const donorRes = await axiosSecure.get(
                `/find-donor?donationId=${donation._id}`
              );
              if (donorRes.data.length > 0) {
                donorData[donation._id] = donorRes.data[0];
              }
            } catch (err) {
              console.error("Error fetching donor for donation:", donation._id);
            }
          })
        );
        setDonors(donorData);
      })
      .catch((err) => {
        console.error("Error fetching donation requests:", err);
      })
      .finally(() => setLoading(false));
  }, [user]);

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
              setDonations((prev) =>
                prev.filter((donation) => donation._id !== id)
              );
              Swal.fire(
                "Deleted!",
                "Your request has been deleted.",
                "success"
              );
            } else {
              Swal.fire("Error", "Deletion failed. Please try again.", "error");
            }
          })
          .catch(() => {
            Swal.fire("Error", "Something went wrong.", "error");
          });
      }
    });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    Swal.fire({
      title: `Change status to "${newStatus}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const res = await axiosSecure.patch("/donation-status", {
          id,
          donationStatus: newStatus,
        });

        if (res.data.modifiedCount > 0) {
          setDonations((prev) =>
            prev.map((donation) =>
              donation._id === id
                ? { ...donation, donationStatus: newStatus }
                : donation
            )
          );
          Swal.fire("Success!", `Status updated to "${newStatus}".`, "success");
        } else {
          Swal.fire("Failed", "Status update failed. Try again.", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong.", "error");
      }
    });
  };

  const filteredDonations =
    filterStatus === "all"
      ? donations
      : donations.filter((d) => d.donationStatus === filterStatus);

  return (
    <div className="px-4 py-6">
      <PageTitle title={"My Donation Request"} />
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
        My Donation Requests
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {["all", "pending", "inprogress", "done", "canceled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
              filterStatus === status
                ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <Loader label="Loading your requests..." />
      ) : filteredDonations.length === 0 ? (
        <p className="text-center text-slate-600 py-8">
          No donation requests found.
        </p>
      ) : (
        <div className="glass p-6 rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-rose-50 to-red-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Recipient
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Blood Group
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Donor Info
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation, i) => (
                  <tr
                    key={donation._id}
                    className={`border-b border-slate-200 hover:bg-rose-50/30 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-rose-50/20"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {donation.recipientName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {donation.recipientDistrict}, {donation.recipientUpazila}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {donation.donationDate} <br />
                      <span className="text-xs opacity-75">
                        {donation.donationTime}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-rose-100 text-rose-700 rounded text-sm font-medium">
                        {donation.bloodGroup}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          donation.donationStatus === "done"
                            ? "bg-green-100 text-green-700"
                            : donation.donationStatus === "inprogress"
                            ? "bg-blue-100 text-blue-700"
                            : donation.donationStatus === "canceled"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {donation.donationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {donors[donation._id] ? (
                        <>
                          <div className="font-medium">
                            {donors[donation._id].donorName}
                          </div>
                          <div className="text-xs text-gray-600">
                            {donors[donation._id].donorEmail}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/details/${donation._id}`}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          View
                        </Link>
                        <Link
                          to={`/dashboard/update-donation-request/${donation._id}`}
                          className="text-green-600 hover:underline text-sm font-medium"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(donation._id)}
                          className="text-red-600 hover:underline text-sm font-medium"
                        >
                          Delete
                        </button>

                        {donation.donationStatus === "inprogress" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(donation._id, "done")
                              }
                              className="text-green-600 hover:underline text-sm font-medium"
                            >
                              Done
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(donation._id, "canceled")
                              }
                              className="text-yellow-600 hover:underline text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
