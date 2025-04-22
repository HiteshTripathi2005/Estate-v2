import jwt from "jsonwebtoken";
import adminModel from "../models/admin.model.js";

const admin = async (req, res, next) => {
  try {
    // Check for token in cookie first
    let token = req?.cookies?.JWT;

    // If no token in cookie, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await adminModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid user token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Unauthorized", error);
    return res.status(401).json({ message: "Unauthorized - " + error.message });
  }
};

export default admin;
