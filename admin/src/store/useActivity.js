import { create } from "zustand";
import instance from "../utils/axios";
import toast from "react-hot-toast";

const useActivityStore = create((set) => ({
  activities: [],
  activitySummary: null,
  userActivities: [],
  loading: false,
  error: null,
  pagination: {
    totalPages: 1,
    currentPage: 1,
    totalActivities: 0,
    perPage: 20,
  },

  getAllActivities: async (page = 1, limit = 20, filters = {}) => {
    try {
      set({ loading: true, error: null });

      // Build query string from filters
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      }).toString();

      const res = await instance.get(`/activity/all?${queryParams}`);

      set({
        activities: res.data.data,
        pagination: res.data.pagination,
        loading: false,
      });

      return res.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch activities",
        loading: false,
      });
      toast.error(
        error.response?.data?.message || "Failed to fetch activities"
      );
      return null;
    }
  },

  getActivitySummary: async () => {
    try {
      set({ loading: true, error: null });

      const res = await instance.get("/activity/summary");

      set({
        activitySummary: res.data.data,
        loading: false,
      });

      return res.data.data;
    } catch (error) {
      console.error("Error fetching activity summary:", error);
      set({
        error:
          error.response?.data?.message || "Failed to fetch activity summary",
        loading: false,
      });
      toast.error(
        error.response?.data?.message || "Failed to fetch activity summary"
      );
      return null;
    }
  },

  getUserActivities: async (userId, page = 1, limit = 20) => {
    try {
      set({ loading: true, error: null });

      const res = await instance.get(
        `/activity/user/${userId}?page=${page}&limit=${limit}`
      );

      set({
        userActivities: res.data.data,
        pagination: res.data.pagination,
        loading: false,
      });

      return res.data;
    } catch (error) {
      console.error("Error fetching user activities:", error);
      set({
        error:
          error.response?.data?.message || "Failed to fetch user activities",
        loading: false,
      });
      toast.error(
        error.response?.data?.message || "Failed to fetch user activities"
      );
      return null;
    }
  },
}));

export default useActivityStore;
