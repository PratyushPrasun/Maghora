
import type { RequestHandler } from "express";

import User from "../modules/users/user.model.js";
import { env } from "../config/env.js";

export const authenticate: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.session.userId;
    const sessionVersion = req.session.authVersion;

    if (!userId || sessionVersion === undefined) {
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
      await new Promise<void>((resolve) => {
        req.session.destroy(() => resolve());
      });

      res.clearCookie("maghora.sid", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

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
