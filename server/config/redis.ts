import { createClient } from "redis";

// Create Redis client
export const redisClient = createClient({
  url: process.env.REDIS_URL,

  socket: {
    reconnectStrategy: (retries) => {
      const delay = Math.min(retries * 500, 5000);

      console.log(`Redis reconnecting in ${delay}ms...`);

      return delay;
    },
  },
});

// Redis event listeners
redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis connection established successfully");
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

// Connect Redis
export const connectRedis = async (): Promise<void> => {
  try {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL is not configured");
    }

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // Verify Redis is responding
    await redisClient.ping();

    console.log("Redis is ready to use");
  } catch (error) {
    console.error("Redis connection failed:", error);
    throw error;
  }
};

// Disconnect Redis
export const disconnectRedis = async (): Promise<void> => {
  if (redisClient.isOpen) {
    await redisClient.quit();
    console.log("Redis disconnected gracefully");
  }
};