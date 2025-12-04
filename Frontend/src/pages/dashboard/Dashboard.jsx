import React, { useContext } from "react";
import Loader from "../../components/Loader";
import { AuthContext } from "../../providers/AuthProvider";
import useRole from "../../hooks/useRole";
import AdminDashboard from "../adminDashboard/AdminDashboard";
import DonorDashboard from "../donorDashboard/DonorDashboard";
import VolunteerDashboard from "../volunteerDashboard/VolunteerDashboard";
import ReceiverDashboard from "../receiverDashboard/ReceiverDashboard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { role, loading } = useRole();

  if (loading) {
    return <Loader label="Loading dashboard..." full={true} />;
  }

  if (role === "admin") {
    return <AdminDashboard user={user} role={role} />;
  }
  if (role === "donor") {
    return <DonorDashboard user={user} role={role} />;
  }
  if (role === "receiver") {
    return <ReceiverDashboard user={user} role={role} />;
  }

  return <VolunteerDashboard user={user} role={role} />;
}
