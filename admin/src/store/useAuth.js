import { create } from "zustand";

const useAuth = create((set) => ({
  user: null,

  Login: async (data) => {
    try {
      const response = await instance.post("/auth/login", data);
    } catch (error) {
      console.error("Error in login: ", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },
}));

export default useAuth;
