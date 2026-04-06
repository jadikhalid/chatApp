import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
}); // Replace with your backend API URL

export default axiosInstance;
