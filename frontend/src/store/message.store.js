import toast from "react-hot-toast";
import { create } from "zustand";
import instance from "../utils/axios";
import { useAuthStore } from "./auth.store";

const useMessageStore = create((set, get) => ({
  sliderUsers: [],
  messages: [],
  isLoading: false,
  messageLoading: false,

  getSliderUsers: async () => {
    try {
      set({ isLoading: true });
      const res = await instance.get("/message/getfriends");
      set({ sliderUsers: res.data.data || [] });
    } catch (error) {
      console.error("Error in fetchUser: ", error);
      toast.error(error?.response?.data?.message || "could not fetch users");
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  getMessages: async (id) => {
    try {
      if (!id) return;
      set({ messageLoading: true });
      const res = await instance.get(`/message/getmessages/${id}`);
      set({ messages: res.data.data || [] });
    } catch (error) {
      console.error("Error in getMessages: ", error);
      toast.error(error?.response?.data?.message || "could not fetch messages");
    } finally {
      set({ messageLoading: false });
    }
  },

  sendMessage: async (message, receiverId) => {
    try {
      if (!message || !receiverId) return;

      const res = await instance.post(`/message/sendmessage/${receiverId}`, {
        message,
      });

      set({
        messages: [...get().messages, res.data.data],
      });
    } catch (error) {
      console.error("Error in sendMessage: ", error);
      toast.error(error?.response?.data?.message || "could not send message");
    }
  },

  addFriends: async (id, navigateOrCallback) => {
    try {
      if (!id) return;

      // Add the user as a friend
      await instance.post(`/message/setfriend/${id}`);

      // Fetch the updated friends list
      const friendsResponse = await instance.get("/message/getfriends");
      const friends = friendsResponse.data.data || [];

      // Find the friend with the matching ID
      const selectedFriend = friends.find((friend) => friend.friend._id === id);

      if (selectedFriend) {
        // Set the selected user in the auth store
        useAuthStore.getState().setSelectedUser(selectedFriend);
      }

      // Handle navigation based on the type of the second parameter
      if (typeof navigateOrCallback === "function") {
        navigateOrCallback("/chat");
      } else if (
        navigateOrCallback &&
        typeof navigateOrCallback.navigate === "function"
      ) {
        navigateOrCallback.navigate("/chat");
      }
    } catch (error) {
      console.error("Error in addFriends: ", error);
      toast.error(error?.response?.data?.message || "could not add friend");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    const user = useAuthStore.getState().user._id;
    const receiverId = useAuthStore.getState().selectedUser?.friend?._id;

    socket.on("message", (message) => {
      if (message.sender !== receiverId) return;
      if (message.receiver !== user) return;

      set({
        messages: [...get().messages, message],
      });
    });
  },

  unSubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("message");
  },
}));

export default useMessageStore;
