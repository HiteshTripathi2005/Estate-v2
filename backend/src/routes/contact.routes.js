import express from "express";
import { sendContactEmail } from "../controllers/contact.controller.js";

const router = express.Router();

// Contact form email route
router.post("/send-email", sendContactEmail);

export default router;
