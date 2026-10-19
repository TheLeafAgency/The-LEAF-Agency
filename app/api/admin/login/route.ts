import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { adminCookieHeader, clearAdminCookieHeader, createAdminToken } from "../../_lib/admin";

const MAX_FAILED_ATTEMPTS = 5;
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

type LoginAttemptRecord = {
  failedAttempts: number;
  lockedUntil?: number;
};

function rateLimitStore() {
  const isProduction = process.env.CONTEXT === "production" && process.env.BRANCH !== "Preview";
  return getStore(`leaf-admin-login-limits-${isProduction ? "production" : "preview"}`, {
    consistency: "strong",
  });
}

function getClientKey(request: Request) {
  // Netlify sets this header at the edge; do not trust arbitrary forwarded-IP headers.
  const clientIp = request.headers.get("x-nf-client-connection-ip") || "unknown-client";
  return createHash("sha256").update(clientIp).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = String(body.password || "");
    const expectedPassword = process.env.LEAF_ADMIN_PASSWORD || "";
    const store = rateLimitStore();
    const key = `login:${getClientKey(request)}`;
    const now = Date.now();

    let record = (await store.get(key, { type: "json" })) as LoginAttemptRecord | null;

    if (record?.lockedUntil && now < record.lockedUntil) {
      const retryAfter = Math.ceil((record.lockedUntil - now) / 1000);
      return Response.json(
        { ok: false, message: "Too many incorrect attempts. Sign-in is locked for one week." },
        { status: 429, headers: { "Retry-After": String(retryAfter), "Cache-Control": "no-store" } }
      );
    }

    // Once the week-long lock has expired, start a fresh five-attempt window.
    if (record?.lockedUntil && now >= record.lockedUntil) {
      record = null;
      await store.delete(key);
    }

    if (!expectedPassword || password !== expectedPassword) {
      const failedAttempts = (record?.failedAttempts || 0) + 1;

      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockedUntil = now + COOLDOWN_MS;
        await store.setJSON(key, { failedAttempts, lockedUntil } satisfies LoginAttemptRecord);
        return Response.json(
          { ok: false, message: "Too many incorrect attempts. Sign-in is locked for one week." },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil(COOLDOWN_MS / 1000)),
              "Cache-Control": "no-store",
            },
          }
        );
      }

      await store.setJSON(key, { failedAttempts } satisfies LoginAttemptRecord);
      return Response.json(
        { ok: false, message: "Incorrect password." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    // A successful login clears this client's failed-attempt counter.
    await store.delete(key);
    const token = createAdminToken();
    return Response.json(
      { ok: true },
      {
        headers: {
          "Set-Cookie": adminCookieHeader(token),
          "Cache-Control": "no-store",
        },
      }
    );
  } catch {
    // Fail closed if the persistent rate-limit store is unavailable.
    return Response.json(
      { ok: false, message: "Unable to sign in right now. Please try again later." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function DELETE() {
  return Response.json(
    { ok: true },
    { headers: { "Set-Cookie": clearAdminCookieHeader(), "Cache-Control": "no-store" } }
  );
}
