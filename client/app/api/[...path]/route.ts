import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DEFAULT_UPSTREAM_API_URL = "http://localhost:5000/api";

function getUpstreamBaseUrl(): string {
  const configured =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_UPSTREAM_API_URL;

  const trimmed = configured.trim().replace(/\/+$/, "");

  // Guard against relative values like "/api" causing infinite recursion.
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return DEFAULT_UPSTREAM_API_URL;
  }

  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

function buildUpstreamUrl(req: NextRequest, pathSegments: string[]): string {
  const baseUrl = getUpstreamBaseUrl();
  const joinedPath = pathSegments.map((seg) => encodeURIComponent(seg)).join("/");
  const targetUrl = joinedPath ? `${baseUrl}/${joinedPath}` : baseUrl;
  return `${targetUrl}${req.nextUrl.search}`;
}

function isRequestHttps(req: NextRequest): boolean {
  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    const firstProto = forwardedProto.split(",")[0].trim().toLowerCase();
    return firstProto === "https";
  }
  return req.nextUrl.protocol === "https:";
}

/**
 * Normalize upstream `Set-Cookie` headers so the session cookie `maghora.sid`
 * is stored by the browser as a first-party, host-only cookie on the storefront
 * origin (eliminating cross-site / third-party cookie rejection in Incognito,
 * Safari ITP, and mobile browsers).
 */
function rewriteSetCookieForSameOrigin(
  rawCookie: string,
  isHttps: boolean
): string {
  const parts = rawCookie.split(";").map((part) => part.trim());
  if (parts.length === 0) return rawCookie;

  const [nameValue, ...attributes] = parts;
  const filtered: string[] = [nameValue];
  let hasSameSite = false;
  let hasSecure = false;

  for (const attr of attributes) {
    if (!attr) continue;
    const lower = attr.toLowerCase();

    // Remove explicit Domain= so the cookie binds as host-only to the current origin.
    if (lower.startsWith("domain=")) {
      continue;
    }

    if (lower.startsWith("samesite=")) {
      hasSameSite = true;
      const value = lower.slice("samesite=".length).trim();
      filtered.push(value === "none" ? "SameSite=Lax" : attr);
      continue;
    }

    if (lower === "secure") {
      hasSecure = true;
      if (isHttps) {
        filtered.push("Secure");
      }
      continue;
    }

    filtered.push(attr);
  }

  if (!hasSameSite) {
    filtered.push("SameSite=Lax");
  }

  if (isHttps && !hasSecure) {
    filtered.push("Secure");
  }

  return filtered.join("; ");
}

function getSetCookieValues(headers: Headers): string[] {
  const headersWithGetSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };
  if (typeof headersWithGetSetCookie.getSetCookie === "function") {
    return headersWithGetSetCookie.getSetCookie();
  }
  const single = headers.get("set-cookie");
  return single ? [single] : [];
}

const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "content-type",
  "cookie",
  "x-requested-with",
  "user-agent",
];

const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-encoding",
  "content-length",
  "set-cookie",
]);

async function handleProxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await context.params;
  const upstreamUrl = buildUpstreamUrl(req, path || []);

  // Prevent infinite self-proxy loops if upstream resolves to this Next.js app.
  try {
    const parsedUpstream = new URL(upstreamUrl);
    if (parsedUpstream.origin === req.nextUrl.origin) {
      return NextResponse.json(
        {
          success: false,
          message: "API proxy misconfiguration: upstream URL points to the frontend origin.",
        },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid upstream API URL." },
      { status: 500 }
    );
  }

  const outboundHeaders = new Headers();
  for (const headerName of FORWARDED_REQUEST_HEADERS) {
    const value = req.headers.get(headerName);
    if (value) {
      outboundHeaders.set(headerName, value);
    }
  }

  // Forward client IP for upstream observability / rate limiting
  const existingForwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  if (existingForwardedFor) {
    outboundHeaders.set("x-forwarded-for", existingForwardedFor);
  } else if (realIp) {
    outboundHeaders.set("x-forwarded-for", realIp);
  }

  // Ensure Origin matches the configured storefront so upstream CORS checks pass if evaluated
  const originHeader = req.headers.get("origin");
  if (originHeader) {
    outboundHeaders.set("origin", originHeader);
  }

  const method = req.method.toUpperCase();
  let requestBody: ArrayBuffer | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const buffer = await req.arrayBuffer();
    if (buffer.byteLength > 0) {
      requestBody = buffer;
    }
  }

  try {
    const upstreamRes = await fetch(upstreamUrl, {
      method,
      headers: outboundHeaders,
      body: requestBody,
      redirect: "manual",
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    upstreamRes.headers.forEach((value, key) => {
      if (!HOP_BY_HOP_RESPONSE_HEADERS.has(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    const https = isRequestHttps(req);
    const setCookies = getSetCookieValues(upstreamRes.headers);
    for (const cookieStr of setCookies) {
      responseHeaders.append(
        "set-cookie",
        rewriteSetCookieForSameOrigin(cookieStr, https)
      );
    }

    if (!responseHeaders.has("cache-control")) {
      responseHeaders.set("cache-control", "no-store, no-cache, must-revalidate");
    }

    const status = upstreamRes.status;
    if (status === 204 || status === 304) {
      return new NextResponse(null, {
        status,
        statusText: upstreamRes.statusText,
        headers: responseHeaders,
      });
    }

    const responseBody = await upstreamRes.arrayBuffer();
    return new NextResponse(responseBody, {
      status,
      statusText: upstreamRes.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[Maghora Proxy] Upstream request failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to reach the Maghora backend service. Please try again shortly.",
      },
      { status: 502 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, context);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, context);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, context);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, context);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, context);
}

export async function OPTIONS(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, context);
}

export async function HEAD(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, context);
}
