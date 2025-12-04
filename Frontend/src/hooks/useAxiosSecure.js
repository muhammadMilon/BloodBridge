import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const useAxiosSecure = () => {
  const { user } = useContext(AuthContext);
  // console.log("🚀 ~ useAxiosSecure ~ accessToken:", user.accessToken);
  const baseURL =
    import.meta.env.VITE_API_URL || "http://localhost:5001";
  const token =
    user?.accessToken || user?.stsTokenManager?.accessToken || "";
  const instance = axios.create({
    baseURL,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return instance;
};

export default useAxiosSecure;
