import React, { useEffect, useRef } from "react";
import useMessageStore from "../../store/message.store";
import { useAuthStore } from "../../store/auth.store";
import MessageInput from "./MessageInput";
import MessageHeader from "./MessageHeader";
import { motion } from "framer-motion";
import Skeleton from "./Skeleton";

const ChatMain = ({ setShowSlider, selectedUser }) => {
  const { user } = useAuthStore();
  const { getMessages, messages, isLoading, messageLoading } =
    useMessageStore();
  const currentUserId = user._id;
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser?.friend?._id);
  }, [selectedUser]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center">
        <h1>Select user to dispaly message</h1>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute top-[85px] left-[402px] max-lg:left-[350px] max-md:left-0 right-0 bottom-0 grid grid-rows-[76px_1fr_76px]"
    >
      {/* Chat Header */}
      <div className="w-full">
        <MessageHeader
          setShowSlider={setShowSlider}
          selectedUser={selectedUser}
          isLoading={isLoading}
        />
      </div>

      {/* Chat Messages */}
      <div
        ref={messagesContainerRef}
        className=" overflow-y-auto overflow-x-hidden p-4 space-y-6"
      >
        {messageLoading ? (
          <Skeleton />
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-full"
          >
            <h1 className="text-2xl"> No messages yet </h1>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {messages.map((message) => (
              <motion.div
                key={`${message._id}`}
                initial={{
                  opacity: 0,
                  x: message.sender === currentUserId ? 50 : -50,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className={`w-fit p-3 mb-2 break-words max-w-[80%] max-sm:max-w-[85%] shadow-sm ${
                  message.sender === currentUserId
                    ? "ml-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tl-lg rounded-bl-lg rounded-tr-sm"
                    : "mr-auto bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-tr-lg rounded-br-lg rounded-tl-sm"
                }`}
              >
                <div className="text-xl max-sm:text-base">
                  {message.message}
                </div>
                <div
                  className={`text-sm max-sm:text-xs mt-1 ${
                    message.sender === currentUserId
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Chat Input */}
      <div className="w-full">
        <MessageInput selectedUser={selectedUser} />
      </div>
    </motion.div>
  );
};

export default ChatMain;
