
import type { Request, Response } from "express";

import argon2 from "argon2";
import User from "../users/user.model.js";

import {
  registerUser,
  loginUser,
  serializeUser,
} from "./auth.service.js";

import {
  requestPasswordReset,
  resetUserPassword,
} from "./password-reset.service.js";

import { env } from "../../config/env.js";

const regenerateSession = async (
  req: Request
): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
};

const saveSession = async (
  req: Request
): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    req.session.save((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
};

const createAuthenticatedSession = async (
  req: Request,
  user: {
    _id: { toString(): string };
    authVersion: number;
  }
): Promise<void> => {
  await regenerateSession(req);

  req.session.userId = user._id.toString();
  req.session.authVersion = user.authVersion;

  await saveSession(req);
};

// Register customer.
export const register = async (
  req: Request,
  res: Response
) => {
  const user = await registerUser(req.body);

  await createAuthenticatedSession(req, user);

  return res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: {
      user: serializeUser(user),
    },
  });
};

// Login using phone or email.
export const login = async (
  req: Request,
  res: Response
) => {
  const user = await loginUser(
    req.body.identifier,
    req.body.password
  );

  await createAuthenticatedSession(req, user);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: serializeUser(user),
    },
  });
};

// Logout.
export const logout = async (
  req: Request,
  res: Response
) => {
  await new Promise<void>((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  res.clearCookie("maghora.sid", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// Current authenticated user.
export const getCurrentUser = async (
  req: Request,
  res: Response
) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.currentUser
        ? serializeUser(req.currentUser)
        : null,
    },
  });
};

// Forgot password.
export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  await requestPasswordReset(req.body.email);

  return res.status(200).json({
    success: true,
    message:
      "If an account exists with this email, a password reset link will be sent shortly.",
  });
};

// Reset password.
export const resetPassword = async (
  req: Request,
  res: Response
) => {
  await resetUserPassword(
    req.body.token,
    req.body.password
  );

  return res.status(200).json({
    success: true,
    message: "Password reset successfully. Please log in again.",
  });
};



export const changePassword = async (
  req: Request,
  res: Response
) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const user = await User.findById(userId).select(
    "+password +authVersion"
  );

  if (!user || !user.isActive) {
    return res.status(401).json({
      success: false,
      message: "Invalid session",
    });
  }

  const currentPasswordMatches = await argon2.verify(
    user.password,
    req.body.currentPassword
  );

  if (!currentPasswordMatches) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  const newPasswordHash = await argon2.hash(
    req.body.password,
    {
      type: argon2.argon2id,
    }
  );

  user.password = newPasswordHash;
  user.authVersion += 1;

  await user.save();

  // Regenerate the current session and invalidate older sessions.
  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  req.session.userId = user._id.toString();
  req.session.authVersion = user.authVersion;

  await new Promise<void>((resolve, reject) => {
    req.session.save((error) => {
      if (error) reject(error);
      else resolve();
    });
  });

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
    data: {
      user: serializeUser(user),
    },
  });
};
