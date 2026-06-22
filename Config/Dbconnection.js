import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ExpenseTracker";
    await mongoose.connect(connUri);
    console.log(`MongoDB Connected: ${connUri}`);
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

export default connectDb;