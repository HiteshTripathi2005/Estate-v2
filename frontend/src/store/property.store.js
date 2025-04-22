import { create } from "zustand";
import instance from "../utils/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./auth.store";

const usePropertyStore = create((set) => ({
  loading: false,
  property: [],
  userProperties: [],
  uploading: false,
  updating: false,
  infoLoading: false,
  info: [],
  watchlistedProperties: [],

  getAllProperties: async () => {
    try {
      set({ loading: true });
      const res = await instance.get("/property/getall");
      set({ property: res.data.data });
      set({ loading: false });
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      set({ loading: false });
    }
  },

  getUserProperties: async () => {
    try {
      const res = await instance.get("/property/user-properties");
      set({ userProperties: res.data.data });
    } catch (error) {
      console.error("Error fetching user properties:", error);
      toast.error("Error fetching user properties");
    }
  },

  uploadProperty: async (formData) => {
    try {
      set({ uploading: true });
      await instance.post("/property/upload", formData);
      toast.success("Property uploaded successfully");
      set({ uploading: false });
    } catch (error) {
      console.error("Error uploading property:", error);
      set({ uploading: false });
      toast.error(error.response.data.message || "Error uploading property");
    }
  },

  updateProperty: async (id, formData) => {
    try {
      set({ updating: true });
      const res = await instance.post(`/property/update/${id}`, formData);
      toast.success("Property updated successfully");
      set({ info: res.data.data });
      set({ updating: false });
      return res.data.data;
    } catch (error) {
      console.error("Error updating property:", error);
      set({ updating: false });
      toast.error(error.response.data.message || "Error updating property");
      return null;
    }
  },

  deleteProperty: async (id) => {
    try {
      const res = await instance.delete(`/property/delete/${id}`);

      toast.success("Property deleted successfully");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error(error.response.data.message || "Error deleting property");
    }
  },

  getPropertyInfo: async (id) => {
    try {
      set({ infoLoading: true });
      const res = await instance.get(`/property/info/${id}`);
      set({ info: res.data.data });
      set({ infoLoading: false });

      // Track property view activity
      const user = useAuthStore.getState().user;
      if (user) {
        try {
          await instance.post("/activity/log", {
            userId: user._id,
            action: "view_property",
            propertyId: id,
            details: { propertyTitle: res.data.data.title },
          });
        } catch (error) {
          console.error("Error tracking property view activity:", error);
        }
      }
    } catch (error) {
      set({ infoLoading: false });
      console.error("Error getting property info:", error);
      toast.error(error.response.data.message || "Error getting property info");
    }
  },

  purchaseProperty: async (id) => {
    try {
      const res = await instance.post(`/property/purchase/${id}`);

      // Log the purchase activity
      await instance.post("/activity/log", {
        userId: useAuthStore.getState().user?._id,
        action: "purchase_property",
        propertyId: id,
        details: { status: "successful" },
      });

      console.log(res.data);
      toast.success("Property purchased successfully");
    } catch (error) {
      console.error("Error purchasing property:", error);
      toast.error(error.response.data.message || "Error purchasing property");
    }
  },

  addWatchList: async (id) => {
    try {
      const res = await instance.post(`/property/watchlist/add`, {
        propertyId: id,
      });
      console.log(res.data.watchlist);
      set({ watchlistedProperties: res.data.watchlist });
      toast.success("Added to watchlist");
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast.error(error.response.data.message || "Error adding to watchlist");
    }
  },

  removeWatchList: async (id) => {
    try {
      const res = await instance.post("/property/watchlist/remove", {
        propertyId: id,
      });

      console.log(res.data.watchlist);
      set({ watchlistedProperties: res.data.watchlist });
      toast.success("Removed from watchlist");
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      toast.error(
        error.response.data.message || "Error removing from watchlist"
      );
    }
  },

  getWatchList: async () => {
    try {
      const res = await instance.get("/property/watchlist");
      set({ watchlistedProperties: res.data.watchlist });
    } catch (error) {
      console.error("Error getting watchlist:", error);
      toast.error(error.response.data.message || "Error getting watchlist");
    }
  },
}));

export default usePropertyStore;
