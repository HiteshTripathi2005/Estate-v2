import { useEffect, useState } from "react";
import ChatMain from "../components/chat/ChatMain";
import ChatSlider from "./../components/chat/ChatSlider";
import AuthNavbar from "../components/common/AuthNavbar";
import useMessageStore from "../store/message.store";
import { useAuthStore } from "../store/auth.store";
import SyncLoader from "react-spinners/esm/SyncLoader";

const Chat = () => {
  const {
    sliderUsers,
    getSliderUsers,
    isLoading,
    subscribeToMessages,
    unSubscribeToMessages,
  } = useMessageStore();
  const { selectedUser, setSelectedUser } = useAuthStore();
  const [showSlider, setShowSlider] = useState(true);

  useEffect(() => {
    getSliderUsers();
    subscribeToMessages();

    return () => {
      unSubscribeToMessages();
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      unSubscribeToMessages(); // Unsubscribe from previous user
      subscribeToMessages(); // Subscribe to new user

      // Hide the slider on mobile when a user is selected
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setShowSlider(false);
      }
    }
  }, [selectedUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SyncLoader />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <AuthNavbar />
      {sliderUsers.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <h1 className="text-2xl">No users to display</h1>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-88px)]">
          <div className={`md:block ${showSlider ? "block" : "hidden"} h-full`}>
            <ChatSlider
              setShowSlider={setShowSlider}
              setSelectedUser={setSelectedUser}
            />
          </div>
          <div
            className={`flex-1 ${
              showSlider ? "hidden" : "block"
            } md:block h-full`}
          >
            <ChatMain
              setShowSlider={setShowSlider}
              selectedUser={selectedUser}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
