import { FaUsers, FaHandHoldingUsd, FaTint } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";

const AdminDashboard = ({ user, role, stats }) => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [request, setRequest] = useState([]);
  const donors = users.filter((user) => user.role === "donor");

  useEffect(() => {
    axiosSecure("/get-users")
      .then(({ data }) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  useEffect(() => {
    axiosSecure("/all-donation-requests")
      .then(({ data }) => setRequest(data))
      .catch((err) => console.error("Error fetching donation requests:", err));
  }, []);
  const totalDone = request.filter(
    (item) => item.donationStatus === "done"
  ).length;
  // stats fallback
  const {
    totalDonor = donors.length,
    totalFunding = 0,
    totalRequests = request.length - totalDone,
  } = stats || {};

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <PageTitle title={"Admin Dashboard"} />

      {/* Welcome Message */}
      {user && (
        <div className="glass mb-8 p-6 sm:p-8 rounded-2xl border border-rose-200 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl">👨‍💼</span>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-text">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                  {user.displayName}
                </span>
                !
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Managing as{" "}
                <span className="font-semibold capitalize">{role}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Users */}
        <div className="glass rounded-2xl p-6 sm:p-8 border-l-4 border-rose-600 shadow-xl card-hover group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">
                Total Donors
              </p>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent">
                {totalDonor}
              </p>
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FaUsers className="text-2xl sm:text-3xl text-white" />
            </div>
          </div>
        </div>

        {/* Total Funding */}
        <div className="glass rounded-2xl p-6 sm:p-8 border-l-4 border-red-600 shadow-xl card-hover group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">
                Total Funding
              </p>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                ${totalFunding}
              </p>
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FaHandHoldingUsd className="text-2xl sm:text-3xl text-white" />
            </div>
          </div>
        </div>

        {/* Total Requests */}
        <div className="glass rounded-2xl p-6 sm:p-8 border-l-4 border-rose-700 shadow-xl card-hover group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">
                Blood Requests
              </p>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-rose-700 to-red-600 bg-clip-text text-transparent">
                {totalRequests}
              </p>
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-rose-700 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FaTint className="text-2xl sm:text-3xl text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
