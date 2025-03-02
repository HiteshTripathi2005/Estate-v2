import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/users.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { app } from "./utils/socket.js";

// const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", userRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/message", messageRoutes);

export default app;
