import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { User } from "../models/users.model.js";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;

  if (userId) {
    userSocketMap[userId] = socket.id;

    // Mark user as active when they connect
    User.findByIdAndUpdate(userId, {
      isActive: true,
      lastLogin: new Date(),
    }).catch((error) => {
      console.error("Error updating user active status:", error);
    });
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", async () => {
    // Mark user as inactive when they disconnect
    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, { isActive: false });
      } catch (error) {
        console.error("Error updating user inactive status:", error);
      }
    }

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
