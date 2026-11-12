
import { Router } from "express";

import {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";

import { changePassword } from "./auth.controller.js";

import {
  changePasswordSchema,
} from "./auth.validation.js";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation.js";

import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";

const router = Router();

// Customer registration
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  register
);

// Customer login
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  login
);

// Current authenticated user
router.get(
  "/me",
  authenticate,
  getCurrentUser
);

// Logout
router.post(
  "/logout",
  authenticate,
  logout
);

// Request password-reset email
router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
);

// Set new password
router.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordSchema),
  resetPassword
);

router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  changePassword
);

export default router;
