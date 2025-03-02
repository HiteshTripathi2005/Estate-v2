import express from "express";
import {
  googleLogin,
  userGet,
  userLogin,
  userLogout,
  userRegister,
  userUpdate,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/login").post(userLogin);
router.route("/google-login").post(googleLogin);
router.route("/register").post(upload.single("profilePic"), userRegister);
router.route("/logout").post(auth, userLogout);
router.route("/getuser").post(auth, userGet);
router.route("/update").post(upload.single("profilePic"), auth, userUpdate);

export default router;
