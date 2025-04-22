import { create } from "zustand";
import instance from "../utils/axios";
import toast from "react-hot-toast";

const useAdminStore = create((set) => ({
  admin: JSON.parse(localStorage.getItem("admin")) || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const res = await instance.post("/admin/login", { email, password });

      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      set({ admin: res.data.admin, loading: false });
      return res.data.admin;
    } catch (error) {
      console.error("Login error:", error);
      set({
        error: error.response?.data?.message || "Login failed",
        loading: false,
      });
      toast.error(error.response?.data?.message || "Login failed");
      return null;
    }
  },

  logout: async () => {
    try {
      await instance.post("/admin/logout");
      localStorage.removeItem("admin");
      set({ admin: null });
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  },

  register: async (userName, email, password) => {
    try {
      set({ loading: true, error: null });
      const res = await instance.post("/admin/register", {
        userName,
        email,
        password,
      });
      set({ loading: false });
      toast.success("Registration successful");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      set({
        error: error.response?.data?.message || "Registration failed",
        loading: false,
      });
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    }
  },
}));

export default useAdminStore;
