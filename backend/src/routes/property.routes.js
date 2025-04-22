import express from "express";
import auth from "../middlewares/auth.middleware.js";
import admin from "../middlewares/admin.middleware.js";
import {
  addToWatchlist,
  deleteProperty,
  demo,
  getProperties,
  getPropertyInfo,
  getWatchlist,
  purchaseProperty,
  removeFromWatchlist,
  updateProperty,
  uploadProperty,
  userProperties,
  getPropertiesByUserId,
  getAllPropertiesForAdmin,
  adminUpdateProperty,
  adminVerifyProperty,
  adminDeleteProperty,
  adminTogglePropertyStatus,
} from "../controllers/property.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/upload").post(upload.array("images"), auth, uploadProperty);
router.route("/demo").post(upload.array("images"), auth, demo);
router.route("/getall").get(getProperties);
router.route("/user-properties").get(auth, userProperties);
router.route("/info/:id").get(auth, getPropertyInfo);
router.route("/update/:id").post(upload.array("images"), auth, updateProperty);
router.route("/delete/:id").delete(auth, deleteProperty);

router.route("/purchase/:id").post(auth, purchaseProperty);

router.route("/watchlist/add").post(auth, addToWatchlist);
router.route("/watchlist/remove").post(auth, removeFromWatchlist);
router.route("/watchlist").get(auth, getWatchlist);

// Admin routes
router.route("/admin/all").get(admin, getAllPropertiesForAdmin);
router.route("/admin/update/:id").put(admin, adminUpdateProperty);
router.route("/admin/verify/:id").put(admin, adminVerifyProperty);
router.route("/admin/delete/:id").delete(admin, adminDeleteProperty);
router.route("/admin/toggle-status/:id").put(admin, adminTogglePropertyStatus);
router.route("/admin/user/:userId").get(admin, getPropertiesByUserId);

export default router;
