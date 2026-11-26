
import type { RequestHandler } from "express";

import User from "../modules/users/user.model.js";
import { COOKIE_NAME, getCookieOptions } from "../config/cookie.js";

export const authenticate: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.session.userId;
    const sessionVersion = req.session.authVersion;

    if (!userId || sessionVersion === undefined) {
      console.warn(
        `[Auth] Unauthorized request to ${req.method} ${req.originalUrl} (no active session)`
      );
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const user = await User.findById(userId).select("+authVersion");

    if (
      !user ||
      !user.isActive ||
      user.authVersion !== sessionVersion
    ) {
      console.warn(
        `[Auth] Session invalidated for user=${userId} on ${req.method} ${req.originalUrl}`
      );
      await new Promise<void>((resolve) => {
        req.session.destroy(() => resolve());
      });

      res.clearCookie(COOKIE_NAME, getCookieOptions(req));

      res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });

      return;
    }

    req.currentUser = user;

    next();
  } catch (error) {
    next(error);
  }
};
