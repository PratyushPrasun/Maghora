
import session from "express-session";
import { RedisStore } from "connect-redis";

import { redisClient } from "./redis.js";
import { env } from "./env.js";
import { COOKIE_NAME, cookieOptions } from "./cookie.js";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export const sessionMiddleware = session({
  name: COOKIE_NAME,

  store: new RedisStore({
    client: redisClient,
    prefix: "maghora:session:",
    ttl: SESSION_DURATION / 1000,
  }),

  secret: env.SESSION_SECRET,
  proxy: true,
  resave: false,
  saveUninitialized: false,

  cookie: {
    ...cookieOptions,
    maxAge: SESSION_DURATION,
  },
});
