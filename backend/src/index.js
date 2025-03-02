import app from "./app.js";
import { server } from "./utils/socket.js";
import dotnev from "dotenv";
import dbConnect from "./db/dbConnect.js";
dotnev.config();

const PORT = process.env.PORT || 8080;

dbConnect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Error connecting to DB: ${error.message}`);
  });
