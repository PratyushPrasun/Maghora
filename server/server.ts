
import "dotenv/config";

import app from "./app.js";
import { env } from "./config/env.js";

import { connectDatabase, disconnectDatabase } from "./config/database.js";

import {
  connectRedis,
  disconnectRedis,
} from "./config/redis.js";

import {
  initializeRateLimiters,
} from "./middlewares/rateLimiter.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import type { Server } from "node:http";
import authRoutes from "./modules/auth/auth.routes.js";
import adminRoutes from "./modules/admins/admin.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import categoryRoutes from "./modules/categories/category.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";
import addressRoutes from "./modules/addresses/address.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";

import { startOrderExpiryWorker } from "./modules/orders/order-expiry.worker.js";

let server: Server | null = null;
let isShuttingDown = false;


const startServer = async (): Promise<void> => {
  try {
    // Step 1: Connect MongoDB
    await connectDatabase();

    // Step 2: Connect Redis
    await connectRedis();

    // Step 3: Initialize Redis-dependent rate limiters
    initializeRateLimiters(app);

    // Step 4: Register API routes AFTER rate limiting

    app.use("/api/auth", authRoutes);

    // Administrator management routes.
    app.use("/api/admins", adminRoutes);

    // Category routes.
    app.use("/api/categories", categoryRoutes);

    // Product routes.
    app.use("/api/products", productRoutes);

    app.use("/api/cart", cartRoutes);

    app.use("/api/orders", orderRoutes);

    app.use("/api/addresses", addressRoutes);

    app.use("/api/payments", paymentRoutes);

    app.get("/api/health", (_req, res) => {
      res.status(200).json({
        success: true,
        message: "Maghora API is running",
        timestamp: new Date().toISOString(),
      });
    });

    startOrderExpiryWorker();

    // Future API routes will be registered here.

    // Step 5: 404 handler
    app.use(notFound);

    // Step 6: Global error handler (always last)
    app.use(errorHandler);

    // Step 7: Start Express
    server = app.listen(env.PORT, () => {
      console.log("--------------------------------");
      console.log(" MAGHORA BACKEND");
      console.log("--------------------------------");
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log(`Port: ${env.PORT}`);
      console.log("MongoDB: Connected");
      console.log("Redis: Connected");
      console.log("Rate Limiting: Enabled");
      console.log("Authentication: Enabled");
      console.log("--------------------------------");
    });
  } catch (error) {
    console.error("Server startup failed:", error);

    await disconnectRedis().catch(() => { });
    await disconnectDatabase().catch(() => { });

    process.exit(1);
  }
};


const shutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) return;

  isShuttingDown = true;

  console.log(`${signal} received. Shutting down...`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }

    await disconnectRedis();
    await disconnectDatabase();

    console.log("All connections closed successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Shutdown failed:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

void startServer();
