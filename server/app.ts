import express from "express";
import cors from "cors";
import helmet from "helmet";

import { sessionMiddleware } from "./config/session.js";
import { env } from "./config/env.js";

const app = express();

app.disable("x-powered-by");

app.set(
  "trust proxy",
  env.NODE_ENV === "production" ? 1 : false
);

app.use(helmet());

app.use(
  cors({
    origin: [env.CLIENT_URL, env.ADMIN_URL],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

app.use(sessionMiddleware);

export default app;