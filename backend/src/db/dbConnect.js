import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.DB_URL}estate`);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to DB: ${error.message}`);
  }
};

export default dbConnect;
