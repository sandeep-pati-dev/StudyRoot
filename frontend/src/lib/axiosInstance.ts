// src/lib/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // or your deployed backend URL
  withCredentials: true, // so cookies (JWT) work
});

export default axiosInstance;
