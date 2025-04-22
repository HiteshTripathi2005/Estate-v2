import toast from "react-hot-toast";
import { create } from "zustand";
import instance from "../utils/axios";
import io from "socket.io-client";
import { auth, googleProvider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";

const BASE_URL = import.meta.env.VITE_SOCKET_URL;

export const useAuthStore = create((set, get) => ({
  fetchingUser: false,
  user: null,
  isLoading: false,
  updatingUser: false,
  savingUser: false,
  socket: null,
  onlineUsers: [],
  selectedUser: null,
  googleAuthLoading: false,
  error: null,

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const response = await instance.post("/auth/getuser");
      set({ user: response.data.data, isLoading: false });
      get().connectSocket();
    } catch (error) {
      set({ isLoading: false });
    }
  },

  register: async (formData) => {
    try {
      set({ savingUser: true });
      const res = await instance.post("/auth/register", formData);
      set({ user: res.data.data });
      set({ savingUser: false });
      get().connectSocket();
      toast.success(res?.data?.message || "Registered successfully");
    } catch (error) {
      console.error("Error in register: ", error);
      set({ savingUser: false });
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },

  login: async (formData) => {
    try {
      set({ fetchingUser: true, error: null });
      const response = await instance.post("/auth/login", formData);
      set({ user: response.data.data, fetchingUser: false });
      get().connectSocket();
      toast.success(response?.data?.message || "Logged in successfully");

      // Track login activity
      try {
        await instance.post("/activity/log", {
          userId: response.data.data._id,
          action: "login",
          details: {
            method: "credential",
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error) {
        console.error("Error tracking login activity:", error);
      }
    } catch (error) {
      console.error("Error in login: ", error);
      set({
        error: error.response?.data?.message || "Login failed",
        fetchingUser: false,
      });
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ fetchingUser: false });
    }
  },

  googleLogin: async () => {
    try {
      set({ googleAuthLoading: true });
      const result = await signInWithPopup(auth, googleProvider);

      // Get the Google user info
      const { displayName, email, photoURL, uid } = result.user;

      // Send the Google user info to our backend
      const response = await instance.post("/auth/google-login", {
        fullName: displayName,
        email,
        profilePic: photoURL,
        googleId: uid,
      });

      set({ user: response.data.data });
      get().connectSocket();
      toast.success(
        response?.data?.message || "Logged in with Google successfully"
      );
    } catch (error) {
      console.error("Error in Google login: ", error);
      toast.error(error?.response?.data?.message || "Google login failed");
    } finally {
      set({ googleAuthLoading: false });
    }
  },

  logout: async () => {
    try {
      await instance.post("/auth/logout");
      set({ user: null });
      get().disconnectSocket();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error in logout: ", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },

  updateUser: async (formData) => {
    try {
      set({ updatingUser: true });
      const res = await instance.post("/auth/update", formData);
      set({ user: res.data.data });
      set({ updatingUser: false });
      toast.success(res?.data?.message || "User updated successfully");
    } catch (error) {
      console.log(error);
      set({ updatingUser: false });
      toast.error("Error updating user");
    }
  },

  connectSocket: async () => {
    try {
      const socket = io(BASE_URL, {
        query: {
          userId: get().user?._id,
        },
      });

      socket.connect();
      set({ socket: socket });

      socket.on("getOnlineUsers", (data) => {
        set({ onlineUsers: data });
      });
    } catch (error) {
      console.error("Error in connectSocket: ", error);
    }
  },

  disconnectSocket: () => {
    try {
      get().socket?.disconnect();
    } catch (error) {
      console.error("Error in disconnectSocket: ", error);
    }
  },
}));
