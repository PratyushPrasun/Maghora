
import { resend } from "../config/resend.js";
import { env } from "../config/env.js";

interface PasswordResetEmailOptions {
  email: string;
  name: string;
  resetUrl: string;
}

export const sendPasswordResetEmail = async ({
  email,
  name,
  resetUrl,
}: PasswordResetEmailOptions): Promise<void> => {
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Reset your Maghora password",

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 24px;">
        <h2>Reset your password</h2>

        <p>Hello ${escapeHtml(name)},</p>

        <p>
          We received a request to reset your Maghora account password.
          Click the button below to create a new password.
        </p>

        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 22px;
            background: #222;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>

        <p>This link expires in 15 minutes and can only be used once.</p>

        <p>If you did not request this, you can safely ignore this email.</p>

        <p>Regards,<br />Maghora Team</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Password reset email failed: ${error.message}`);
  }
};

const escapeHtml = (value: string): string => {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
};
