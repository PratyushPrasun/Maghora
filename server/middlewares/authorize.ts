
import type { RequestHandler } from "express";
import type { UserRole } from "../modules/users/user.model.js";

export const authorize = (
  ...allowedRoles: UserRole[]
): RequestHandler => {
  return (req, res, next) => {
    if (!req.currentUser) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    if (!allowedRoles.includes(req.currentUser.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });

      return;
    }

    next();
  };
};
