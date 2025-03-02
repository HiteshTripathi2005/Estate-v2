import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../utils/socket.js";
import Friend from "./../models/friend.model.js";

export const setFriendship = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: friendId } = req.params;

    if (!friendId) {
      return res.status(400).json({ message: "Friend id is required" });
    }

    if (userId == friendId) {
      return res.status(400).json({ message: "This is your own property." });
    }

    const response = await Friend.find({
      $or: [
        {
          user: userId,
          friend: friendId,
        },
        {
          user: friendId,
          friend: userId,
        },
      ],
    });

    if (!response.length == 0) {
      return res
        .status(200)
        .json({ message: "Friendship already exists", data: response });
    }

    const friend = await Friend.create({
      user: userId,
      friend: friendId,
    });

    await Friend.create({
      user: friendId,
      friend: userId,
    });

    return res
      .status(200)
      .json({ message: "Friendship created successfully", data: friend });
  } catch (error) {
    console.error("Error in setFriendship: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriends = async (req, res) => {
  const { _id: userId } = req.user;

  try {
    const friends = await Friend.find({ user: userId }).populate("friend", [
      "userName",
      "fullName",
      "profilePic",
    ]);

    if (friends.length === 0) {
      return res.status(200).json({ message: "No friends" });
    }

    return res.status(200).json({ message: "Friends fetched", data: friends });
  } catch (error) {
    console.error("Error in getFriends: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  const { _id: userId } = req.user;
  const { id: receiverId } = req.params;
  const { message } = req.body;

  try {
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const newMessage = await Message.create({
      sender: userId,
      receiver: receiverId,
      message,
    });

    if (!newMessage) {
      return res.status(400).json({ message: "Message not sent" });
    }

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", newMessage);
    }

    return res
      .status(200)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error("Error in sendMessage: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { id: receiverId } = req.params;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver id is required" });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    });

    if (messages.length === 0) {
      return res.status(200).json({ message: "No messages" });
    }

    return res
      .status(200)
      .json({ message: "Messages fetched", data: messages });
  } catch (error) {
    console.error("Error in getMessages: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
