import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connUri = process.env.DB_URL;
    await mongoose.connect(connUri);
    console.log(`MongoDB Connected`);
  } catch (err) {
    console.error("Database connection error:", err);
    // Rethrow so callers can handle startup failures and avoid accepting requests
    throw err;
  }
};

export default connectDb;