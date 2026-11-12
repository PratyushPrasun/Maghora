
import type { RequestHandler } from "express";

export const requirePasswordChangeComplete: RequestHandler = (
  req,
  res,
  next
) => {
  const user = req.currentUser;

  if (
    user &&
    (user.role === "admin" || user.role === "super_admin") &&
    user.mustChangePassword
  ) {
    res.status(403).json({
      success: false,
      code: "PASSWORD_CHANGE_REQUIRED",
      message: "Please change your initial password before continuing.",
    });

    return;
  }

  next();
};
