import express from "express";
import {
  adminGet,
  adminLogin,
  adminRegister,
  googleLogin,
  userGet,
  userLogin,
  userLogout,
  userRegister,
  userUpdate,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import admin from "../middlewares/admin.middleware.js";

const router = express.Router();

router.route("/login").post(userLogin);
router.route("/google-login").post(googleLogin);
router.route("/register").post(upload.single("profilePic"), userRegister);
router.route("/logout").post(auth, userLogout);
router.route("/getuser").post(auth, userGet);
router.route("/update").post(upload.single("profilePic"), auth, userUpdate);

router.route("/admin/login").post(adminLogin);
router.route("/admin/register").post(adminRegister);
router.route("/admin/logout").post(auth, userLogout);
router.route("/admin/getuser").get(admin, adminGet);

export default router;
