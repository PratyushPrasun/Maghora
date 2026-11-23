
import { env } from "./env.js";

/**
 * Centralised cookie options for the session cookie `maghora.sid`.
 *
 * Every place that sets or clears this cookie MUST use these options
 * so the browser can match them exactly.  In production the options
 * include:
 *
 * - `secure: true`          – cookie sent only over HTTPS
 * - `sameSite: "none"`      – required for cross-origin requests
 *                             (client on a different subdomain / origin)
 * - `domain: COOKIE_DOMAIN` – e.g. ".maghora.in" so the cookie is
 *                             visible to all subdomains
 *
 * In development the cookie stays on localhost with `sameSite: "lax"`.
 */

const isProduction = env.NODE_ENV === "production";

export const COOKIE_NAME = "maghora.sid";

export const cookieOptions: {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "none";
  path: string;
  domain?: string;
} = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  ...(isProduction && env.COOKIE_DOMAIN
    ? { domain: env.COOKIE_DOMAIN }
    : {}),
};
