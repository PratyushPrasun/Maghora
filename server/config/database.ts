import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI!
    );

    console.log(
      `MongoDB connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected gracefully");
};