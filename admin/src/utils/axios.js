import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api", // Updated port from 8000 to 8080
  withCredentials: true,
});

// Add request interceptor to include auth token in headers
// instance.interceptors.request.use(
//   (config) => {
//     // Get admin token from localStorage (if it exists)
//     const admin = JSON.parse(localStorage.getItem("admin"));

//     // If admin exists and JWT cookie isn't being sent properly,
//     // add Authorization header as fallback
//     if (admin && admin._id) {
//       // You might need to store the token separately in localStorage
//       // This is just a temporary solution
//       const token = localStorage.getItem("adminToken");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default instance;
