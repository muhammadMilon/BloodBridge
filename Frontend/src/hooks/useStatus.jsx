import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";

export default function useStatus() {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (!user) {
      setStatus("");
      setLoading(false);
      return;
    }

    setLoading(true);
    axiosSecure
      .get("/get-user-status")
      .then((res) => {
        setStatus(res.data.status);
      })
      .catch((err) => {
        console.error("Failed to load user status:", err);
        setStatus("");
      })
      .finally(() => setLoading(false));
  }, [user]);

  return { status, loading };
}
