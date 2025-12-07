import axios from "axios";

const useAxiosPublic = () => {
  const baseURL =
    import.meta.env.VITE_API_URL || "http://localhost:5001";
  const instance = axios.create({
    baseURL,
    withCredentials: true,
  });

  return instance;
};

export default useAxiosPublic;
