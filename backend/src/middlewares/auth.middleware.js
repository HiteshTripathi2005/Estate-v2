import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

const auth = async (req, res, next) => {
  try {
    const token = req?.cookies?.JWT;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Inavalid user token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Unauthorized", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default auth;
