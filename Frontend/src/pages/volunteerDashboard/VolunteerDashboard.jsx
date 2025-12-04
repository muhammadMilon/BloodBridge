import { FaUsers, FaHandHoldingUsd, FaTint } from "react-icons/fa";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import PageTitle from "../../components/PageTitle";

const VolunteerDashboard = ({ user, role, stats }) => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [request, setRequest] = useState([]);
  const donors = users.filter((user) => user.role === "donor");
  useEffect(() => {
    axiosSecure("/get-users-for-volunteer")
      .then(({ data }) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  useEffect(() => {
    axiosSecure("/all-donation-requests")
      .then(({ data }) => setRequest(data))
      .catch((err) => console.error("Error fetching donation requests:", err));
  }, []);
  // console.log(request);
  const totalDone = request.filter(
    (item) => item.donationStatus === "done"
  ).length;
  // console.log(totalDone);

  // stats fallback
  const {
    totalDonor = donors.length,
    totalFunding = 0,
    totalRequests = request.length - totalDone,
  } = stats || {};

  return (
    <div className="w-full">
      <PageTitle title={"Volunteer Dashboard"} />
      {/* Welcome Message */}
      {user && (
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-4 text-center overflow-hidden rounded-md shadow-md mb-6">
          <p className="text-sm md:text-base font-medium animate-pulse">
            Welcome back, <span className="font-bold">{user.displayName}</span>!
            <span className="ml-2 hidden sm:inline">Your role is {role}.</span>
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-red-500 to-rose-500 text-white rounded-xl p-6 shadow-lg flex items-center gap-4">
          <FaUsers className="text-4xl md:text-5xl text-white opacity-90" />
          <div>
            <p className="text-3xl font-bold">{totalDonor}</p>
            <p className="text-sm md:text-base font-medium">Total Donors</p>
          </div>
        </div>

        {/* Total Funding */}
        <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white rounded-xl p-6 shadow-lg flex items-center gap-4">
          <FaHandHoldingUsd className="text-4xl md:text-5xl text-white opacity-90" />
          <div>
            <p className="text-3xl font-bold">${totalFunding}</p>
            <p className="text-sm md:text-base font-medium">Total Funding</p>
          </div>
        </div>

        {/* Total Requests */}
        <div className="bg-gradient-to-br from-red-600 to-rose-600 text-white rounded-xl p-6 shadow-lg flex items-center gap-4">
          <FaTint className="text-4xl md:text-5xl text-white opacity-90" />
          <div>
            <p className="text-3xl font-bold">{totalRequests}</p>
            <p className="text-sm md:text-base font-medium">Blood Requests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
