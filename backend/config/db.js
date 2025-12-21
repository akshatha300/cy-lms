import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "MONGO_URI is not set. Configure it in your environment variables (Render dashboard)"
      );
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("❌ MongoDB Connection Error:");
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
