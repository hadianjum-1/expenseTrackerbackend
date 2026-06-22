import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connUri = process.env.DB_URL;
    await mongoose.connect(connUri);
    console.log(`MongoDB Connected: ${connUri}`);
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

export default connectDb;