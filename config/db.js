import mongoose from "mongoose";
    const mongoUri = process.env.mongodb//localhost:27017/lms_conten; 
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
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
