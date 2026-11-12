
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

import type { Express, RequestHandler } from "express";

import { redisClient } from "../config/redis.js";

// Prevent duplicate initialization.
let isInitialized = false;

// Authentication limiter reference.
let authLimiterInstance: RequestHandler | null = null;

// Create Redis-backed rate-limit store.
const createRedisStore = (prefix: string) => {
  return new RedisStore({
    prefix,

    sendCommand: (...args: string[]) =>
      redisClient.sendCommand(args),
  });
};

export const initializeRateLimiters = (
  app: Express
): void => {
  if (isInitialized) {
    throw new Error("Rate limiters are already initialized");
  }

  if (!redisClient.isReady) {
    throw new Error(
      "Cannot initialize rate limiters: Redis is not ready"
    );
  }

  // General API rate limiter.
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    store: createRedisStore("rl:general:"),

    passOnStoreError: false,

    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  });

  // Authentication rate limiter.
  authLimiterInstance = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    store: createRedisStore("rl:auth:"),

    passOnStoreError: false,

    message: {
      success: false,
      message: "Too many authentication attempts.",
    },
  });

  // Apply general limiter to API routes.
  app.use("/api", generalLimiter);

  isInitialized = true;

  console.log("Redis rate limiters initialized successfully");
};

// Reusable authentication middleware.
export const authLimiter: RequestHandler = (
  req,
  res,
  next
) => {
  if (!authLimiterInstance) {
    res.status(503).json({
      success: false,
      message: "Authentication service temporarily unavailable",
    });

    return;
  }

  authLimiterInstance(req, res, next);
};
