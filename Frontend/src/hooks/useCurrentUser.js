import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../providers/AuthProvider";

export default function useCurrentUser() {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!user) {
        if (isMounted) {
          setCurrentUser(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const res = await axiosSecure.get("/get-user");
        if (isMounted) {
          setCurrentUser(res.data);
        }
      } catch (err) {
        console.error("Failed to load current user:", err);
        // Fallback to basic Firebase user so profile still works
        if (isMounted) {
          setCurrentUser({
            email: user.email,
            name: user.displayName || "",
            image: user.photoURL || "",
            role: "receiver",
            status: "active",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [user, axiosSecure]);

  return { currentUser, loading };
}
