import type { Request } from "express";
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
 * - `domain: COOKIE_DOMAIN` – e.g. ".maghora.in" when the request host
 *                             belongs to that domain
 *
 * If `COOKIE_DOMAIN` does not match the request hostname (for example,
 * `COOKIE_DOMAIN=.maghora.in` while requests hit `maghora.onrender.com`),
 * `domain` is omitted so browsers accept a valid host-only cookie rather
 * than silently rejecting a domain mismatch.
 */

const isProduction = env.NODE_ENV === "production";

export const COOKIE_NAME = "maghora.sid";

export type SessionCookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "none";
  path: string;
  domain?: string;
};

function domainMatchesHost(cookieDomain: string, hostname: string): boolean {
  const normalizedDomain = cookieDomain.replace(/^\./, "").toLowerCase();
  const normalizedHost = hostname.toLowerCase();
  return (
    normalizedHost === normalizedDomain ||
    normalizedHost.endsWith(`.${normalizedDomain}`)
  );
}

export function getCookieOptions(req?: Request): SessionCookieOptions {
  const requestHost = req?.hostname;
  const shouldApplyDomain =
    isProduction &&
    Boolean(env.COOKIE_DOMAIN) &&
    (!requestHost || domainMatchesHost(env.COOKIE_DOMAIN!, requestHost));

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    ...(shouldApplyDomain ? { domain: env.COOKIE_DOMAIN } : {}),
  };
}

export const cookieOptions: SessionCookieOptions = getCookieOptions();
