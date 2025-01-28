import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true, // Ensures cookies are sent
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosInstance;
