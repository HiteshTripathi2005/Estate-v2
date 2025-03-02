import express from "express";
import {
  getFriends,
  getMessages,
  sendMessage,
  setFriendship,
} from "../controllers/messages.controller.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/setfriend/:id").post(auth, setFriendship);
router.route("/getfriends").get(auth, getFriends);
router.route("/sendmessage/:id").post(auth, sendMessage);
router.route("/getmessages/:id").get(auth, getMessages);

export default router;
