import express from "express";
import cors from "cors";
import helmet from "helmet";
import type { Request } from "express";

import { sessionMiddleware } from "./config/session.js";
import { env } from "./config/env.js";

const app = express();

app.disable("x-powered-by");

app.set(
  "trust proxy",
  env.NODE_ENV === "production" ? 1 : false
);

app.use(helmet());

const baseOrigins = [env.CLIENT_URL, env.ADMIN_URL, env.FRONTEND_URL];
const allowedOriginsSet = new Set<string>();

for (const origin of baseOrigins) {
  allowedOriginsSet.add(origin);
  try {
    const parsed = new URL(origin);
    const portSuffix = parsed.port ? `:${parsed.port}` : "";
    if (parsed.hostname.startsWith("www.")) {
      allowedOriginsSet.add(
        `${parsed.protocol}//${parsed.hostname.slice(4)}${portSuffix}`
      );
    } else if (
      parsed.hostname !== "localhost" &&
      parsed.hostname !== "127.0.0.1" &&
      parsed.hostname.split(".").length === 2
    ) {
      allowedOriginsSet.add(
        `${parsed.protocol}//www.${parsed.hostname}${portSuffix}`
      );
    }
  } catch {
    // Ignore invalid URL strings; env validation enforces valid origins.
  }
}

const allowedOrigins = [...allowedOriginsSet];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({
    verify: (req, _res, buffer) => {
      const request = req as Request & {
        rawBody?: Buffer;
      };

      const pathname = (request.originalUrl || req.url || "").split("?")[0];

      if (pathname === "/api/payments/webhook") {
        request.rawBody = Buffer.from(buffer);
      }
    },
  }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

app.use(sessionMiddleware);

export default app;