import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export default function useCurrentUser() {
  const { user, loading } = useContext(AuthContext);
  return { currentUser: user, loading };
}
