import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  getAllAdmins,
} from "../controllers/admin.controller.js";
import admin from "../middlewares/admin.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

// Protected routes
router.get("/me", admin, getCurrentAdmin);
router.get("/all", admin, getAllAdmins);

export default router;
