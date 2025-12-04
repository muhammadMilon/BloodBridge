import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import useAxiosPublic from "../hooks/axiosPublic";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const axiosPublic = useAxiosPublic();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleProvider = new GoogleAuthProvider();

  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const updateUser = (userInfo) => {
    return updateProfile(auth.currentUser, userInfo);
  };

  const removeUser = (user) => {
    return deleteUser(user);
  };

  const logOut = () => {
    return signOut(auth);
  };

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     console.log("🚀 ~ unsubscribe ~ currentUser:", currentUser);
  //     setUser(currentUser);
  //     if (currentUser) {
  //       axiosPublic
  //         .post("/add-user", {
  //           email: currentUser.email,
  //           role: "donor",
  //           loginCount: 1,
  //         })
  //         .then((res) => {
  //           setUser(currentUser);
  //           console.log(res.data);
  //         });
  //     }

  //     setLoading(false);
  //   });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("🚀 ~ unsubscribe ~ currentUser:", currentUser);
      setUser(currentUser);

      // Ensure a corresponding user document exists / is updated in the backend
      if (currentUser?.email) {
        axiosPublic
          .post("/add-user", {
            email: currentUser.email,
            role: "donor", // backend will ignore this if user already exists
            loginCount: 1,
          })
          .catch((err) => {
            console.error("Failed to sync user with backend:", err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth, axiosPublic]);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    setUser,
    logOut,
    googleSignIn,
    updateUser,
    removeUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
