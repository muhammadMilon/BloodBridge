
import { useContext } from "react";
import useRole from "../hooks/useRole";
import AdminProfile from "../pages/adminDashboard/Profile";
import DonorProfile from "../pages/donorDashboard/Profile";
import ReceiverProfile from "../pages/receiverDashboard/Profile";
import { AuthContext } from "../providers/AuthProvider";
import Loader from "./Loader";
import WelcomeMsg from "./WelcomeMsg";

export default function RoleBasedProfile() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { role, loading: roleLoading } = useRole();

  if (authLoading || (roleLoading && user)) {
    return <Loader label="Loading profile..." />;
  }

  if (!user) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">User not found</h2>
              <p className="text-slate-600">Please log in to view your profile.</p>
          </div>
      );
  }

  if (role === "admin") {
    return <AdminProfile />;
  }

  if (role === "donor") {
    return <DonorProfile />;
  }

  if (role === "receiver") {
    return <ReceiverProfile />;
  }

  return (
    <div className="p-8 text-center">
       <WelcomeMsg />
       <p className="text-slate-600">
           Profile not available for role: {role}
       </p>
    </div>
  );
}
