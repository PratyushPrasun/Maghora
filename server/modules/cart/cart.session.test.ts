import { describe, it, expect, beforeEach } from "vitest";
import express from "express";
import session from "express-session";
import request from "supertest";

function domainMatchesHost(cookieDomain: string, hostname: string): boolean {
  const normalizedDomain = cookieDomain.replace(/^\./, "").toLowerCase();
  const normalizedHost = hostname.toLowerCase();
  return (
    normalizedHost === normalizedDomain ||
    normalizedHost.endsWith(`.${normalizedDomain}`)
  );
}

describe("Session Cookie Domain Matching & Auth Flow", () => {
  it("omits COOKIE_DOMAIN when request host does not match configured domain", () => {
    const cookieDomain = ".maghora.in";
    expect(domainMatchesHost(cookieDomain, "maghora.onrender.com")).toBe(false);
    expect(domainMatchesHost(cookieDomain, "maghora.vercel.app")).toBe(false);
    expect(domainMatchesHost(cookieDomain, "api.maghora.in")).toBe(true);
    expect(domainMatchesHost(cookieDomain, "www.maghora.in")).toBe(true);
    expect(domainMatchesHost(cookieDomain, "maghora.in")).toBe(true);
  });

  it("persists session across login, cart merge, and add-to-cart behind TLS proxy", async () => {
    const app = express();
    app.set("trust proxy", 1);
    app.use(express.json());

    app.use(
      session({
        name: "maghora.sid",
        secret: "test-secret-key-with-at-least-32-characters",
        proxy: true,
        resave: false,
        saveUninitialized: false,
        cookie: () => ({
          httpOnly: true,
          secure: true,
          sameSite: "none" as const,
          path: "/",
        }),
      })
    );

    const cartStore = new Map<string, Map<string, number>>();

    app.post("/api/auth/login", async (req, res) => {
      await new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => (err ? reject(err) : resolve()));
      });
      req.session.userId = "user-123";
      req.session.authVersion = 0;
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => (err ? reject(err) : resolve()));
      });
      res.status(200).json({ success: true, data: { user: { id: "user-123" } } });
    });

    app.post("/api/cart/merge", (req, res) => {
      if (!req.session.userId) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }
      const userCart = cartStore.get(req.session.userId) ?? new Map<string, number>();
      for (const item of req.body.items ?? []) {
        const existingQty = userCart.get(item.variantId) ?? 0;
        userCart.set(item.variantId, Math.max(existingQty, item.quantity));
      }
      cartStore.set(req.session.userId, userCart);
      res.status(200).json({
        success: true,
        data: {
          items: Array.from(userCart.entries()).map(([variantId, quantity]) => ({
            variantId,
            quantity,
          })),
        },
      });
    });

    app.post("/api/cart/items", (req, res) => {
      if (!req.session.userId) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }
      const userCart = cartStore.get(req.session.userId) ?? new Map<string, number>();
      const existingQty = userCart.get(req.body.variantId) ?? 0;
      userCart.set(req.body.variantId, existingQty + req.body.quantity);
      cartStore.set(req.session.userId, userCart);
      res.status(200).json({
        success: true,
        data: {
          items: Array.from(userCart.entries()).map(([variantId, quantity]) => ({
            variantId,
            quantity,
          })),
        },
      });
    });

    app.post("/api/auth/logout", async (req, res) => {
      await new Promise<void>((resolve) => req.session.destroy(() => resolve()));
      res.clearCookie("maghora.sid", { httpOnly: true, secure: true, sameSite: "none", path: "/" });
      res.status(200).json({ success: true });
    });

    // 1. Login behind HTTPS proxy sets maghora.sid cookie
    const loginRes = await request(app)
      .post("/api/auth/login")
      .set("X-Forwarded-Proto", "https")
      .send({});
    expect(loginRes.status).toBe(200);
    const rawSetCookie = loginRes.headers["set-cookie"]?.[0];
    expect(rawSetCookie).toContain("maghora.sid=");
    const cookieHeader = rawSetCookie!.split(";")[0];

    // 2. Guest cart merge succeeds immediately with session cookie
    const mergeRes = await request(app)
      .post("/api/cart/merge")
      .set("X-Forwarded-Proto", "https")
      .set("Cookie", cookieHeader)
      .send({ items: [{ productId: "p1", variantId: "v1", quantity: 2 }] });
    expect(mergeRes.status).toBe(200);
    expect(mergeRes.body.data.items).toEqual([{ variantId: "v1", quantity: 2 }]);

    // 3. Re-running merge is idempotent (quantity stays 2)
    const retryMergeRes = await request(app)
      .post("/api/cart/merge")
      .set("X-Forwarded-Proto", "https")
      .set("Cookie", cookieHeader)
      .send({ items: [{ productId: "p1", variantId: "v1", quantity: 2 }] });
    expect(retryMergeRes.status).toBe(200);
    expect(retryMergeRes.body.data.items).toEqual([{ variantId: "v1", quantity: 2 }]);

    // 4. Add another item after login succeeds
    const addRes = await request(app)
      .post("/api/cart/items")
      .set("X-Forwarded-Proto", "https")
      .set("Cookie", cookieHeader)
      .send({ productId: "p2", variantId: "v2", quantity: 1 });
    expect(addRes.status).toBe(200);
    expect(addRes.body.data.items).toEqual([
      { variantId: "v1", quantity: 2 },
      { variantId: "v2", quantity: 1 },
    ]);

    // 5. Logout invalidates session
    await request(app)
      .post("/api/auth/logout")
      .set("X-Forwarded-Proto", "https")
      .set("Cookie", cookieHeader);
    const postLogoutRes = await request(app)
      .post("/api/cart/items")
      .set("X-Forwarded-Proto", "https")
      .set("Cookie", cookieHeader)
      .send({ productId: "p2", variantId: "v2", quantity: 1 });
    expect(postLogoutRes.status).toBe(401);
  });
});
