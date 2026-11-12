
import { createHash, randomBytes } from "node:crypto";
import argon2 from "argon2";

import User from "../users/user.model.js";
import PasswordReset from "./password-reset.model.js";

import { env } from "../../config/env.js";
import { sendPasswordResetEmail } from "../../services/email.service.js";

const RESET_TOKEN_EXPIRY = 15 * 60 * 1000;

// Hash reset token before storing or querying it.
const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

// Request password-reset email.
export const requestPasswordReset = async (
  email: string
): Promise<void> => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
    isActive: true,
  });

  // Never reveal whether an account exists.
  if (!user) return;

  // Invalidate previously generated reset links.
  await PasswordReset.deleteMany({
    userId: user._id,
  });

  // Generate a secure random token.
  const rawToken = randomBytes(32).toString("hex");

  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date(
    Date.now() + RESET_TOKEN_EXPIRY
  );

  await PasswordReset.create({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  const resetUrl =
    `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  try {
    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl,
    });
  } catch (error) {
    // Remove token if email delivery fails.
    await PasswordReset.deleteOne({ tokenHash });

    console.error(
      "Password reset email delivery failed:",
      error
    );
  }
};

// Reset user password.
export const resetUserPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  const tokenHash = hashToken(token);

  const hashedPassword = await argon2.hash(newPassword, {
    type: argon2.argon2id,
  });

  const session = await User.startSession();

  try {
    await session.withTransaction(async () => {
      // Find a valid, unexpired reset token.
      const resetRecord = await PasswordReset.findOne({
        tokenHash,
        expiresAt: { $gt: new Date() },
      }).session(session);

      if (!resetRecord) {
        throw Object.assign(
          new Error("Invalid or expired password reset link"),
          { statusCode: 400 }
        );
      }

      // Update password and invalidate existing sessions.
      const user = await User.findOneAndUpdate(
        {
          _id: resetRecord.userId,
          isActive: true,
        },
        {
          $set: {
            password: hashedPassword,
            mustChangePassword: false,
          },
          $inc: {
            authVersion: 1,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!user) {
        throw Object.assign(
          new Error("Unable to reset password"),
          { statusCode: 400 }
        );
      }

      // Consume the reset token only after successful password update.
      await PasswordReset.deleteOne({
        _id: resetRecord._id,
      }).session(session);

      // Invalidate any other outstanding reset links.
      await PasswordReset.deleteMany({
        userId: resetRecord.userId,
      }).session(session);
    });
  } finally {
    await session.endSession();
  }
};
