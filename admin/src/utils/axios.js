import { create } from "axios";

const axiosInstace = create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default axiosInstace;
