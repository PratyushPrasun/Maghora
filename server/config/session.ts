
import session from "express-session";
import { RedisStore } from "connect-redis";

import { redisClient } from "./redis.js";
import { env } from "./env.js";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export const sessionMiddleware = session({
  name: "maghora.sid",

  store: new RedisStore({
    client: redisClient,
    prefix: "maghora:session:",
    ttl: SESSION_DURATION / 1000,
  }),

  secret: env.SESSION_SECRET,

  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  },
});
