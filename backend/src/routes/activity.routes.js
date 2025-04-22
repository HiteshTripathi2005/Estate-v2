import express from "express";
import admin from "../middlewares/admin.middleware.js";
import {
  getAllActivities,
  getActivitySummary,
  getUserActivities,
  logActivity,
} from "../controllers/activity.controller.js";

const router = express.Router();

// Routes that require admin authentication
router.get("/all", admin, getAllActivities);
router.get("/summary", admin, getActivitySummary);
router.get("/user/:userId", admin, getUserActivities);

// Route to manually log activity (might be used in certain scenarios)
router.post("/log", logActivity);

export default router;
