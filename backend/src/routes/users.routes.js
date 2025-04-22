import express from "express";
import {
  googleLogin,
  userGet,
  userLogin,
  userLogout,
  userRegister,
  userUpdate,
  // Admin user management functions
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  verifyUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import admin from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public routes
router.route("/login").post(userLogin);
router.route("/google-login").post(googleLogin);
router.route("/register").post(upload.single("profilePic"), userRegister);

// Protected user routes
router.route("/logout").post(auth, userLogout);
router.route("/getuser").post(auth, userGet);
router.route("/update").post(upload.single("profilePic"), auth, userUpdate);

// Protected admin routes for user management
router.route("/admin/all").get(admin, getAllUsers);
router.route("/admin/:id").get(admin, getUserById);
router.route("/admin/update/:id").put(admin, updateUser);
router.route("/admin/delete/:id").delete(admin, deleteUser);
router.route("/admin/block/:id").put(admin, blockUser);
router.route("/admin/unblock/:id").put(admin, unblockUser);
router.route("/admin/verify/:id").put(admin, verifyUser);

export default router;
