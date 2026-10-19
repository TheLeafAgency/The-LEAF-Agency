import { createHash, randomUUID } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { adminCookieHeader, clearAdminCookieHeader, createAdminToken } from "../../_lib/admin";

const MAX_FAILED_ATTEMPTS = 5;
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
const DEVICE_COOKIE = "leaf_login_device";

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

function readCookie(request: Request, name: string) {
  return (request.headers.get("cookie") || "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function responseHeaders(deviceId: string, needsDeviceCookie: boolean, extraCookie?: string) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (needsDeviceCookie) {
    headers.append("Set-Cookie", `${DEVICE_COOKIE}=${deviceId}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=31536000`);
  }
  if (extraCookie) headers.append("Set-Cookie", extraCookie);
  return headers;
}

function deviceKey(deviceId: string) {
  return createHash("sha256").update(deviceId).digest("hex");
}

export async function POST(request: Request) {
  let deviceId = readCookie(request, DEVICE_COOKIE);
  const needsDeviceCookie = !deviceId;

  // Each browser profile receives its own random identifier. A new device's
  // failed attempts won't lock out another device sharing the same Wi-Fi.
  if (!deviceId || !/^[0-9a-f-]{36}$/i.test(deviceId)) deviceId = randomUUID();

  try {
    const body = await request.json();
    const password = String(body.password || "");
    const expectedPassword = process.env.LEAF_ADMIN_PASSWORD || "";
    const store = rateLimitStore();
    const key = `login:${deviceKey(deviceId)}`;
    const now = Date.now();

    let record = (await store.get(key, { type: "json" })) as LoginAttemptRecord | null;

    if (record?.lockedUntil && now < record.lockedUntil) {
      const retryAfter = Math.ceil((record.lockedUntil - now) / 1000);
      return Response.json(
        { ok: false, message: "Too many incorrect attempts. Sign-in is locked for one week." },
        {
          status: 429,
          headers: (() => {
            const headers = responseHeaders(deviceId!, needsDeviceCookie);
            headers.set("Retry-After", String(retryAfter));
            return headers;
          })(),
        }
      );
    }

    if (record?.lockedUntil && now >= record.lockedUntil) {
      record = null;
      await store.delete(key);
    }

    if (!expectedPassword || password !== expectedPassword) {
      const failedAttempts = (record?.failedAttempts || 0) + 1;

      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockedUntil = now + COOLDOWN_MS;
        await store.setJSON(key, { failedAttempts, lockedUntil } satisfies LoginAttemptRecord);
        const headers = responseHeaders(deviceId!, needsDeviceCookie);
        headers.set("Retry-After", String(Math.ceil(COOLDOWN_MS / 1000)));
        return Response.json(
          { ok: false, message: "Too many incorrect attempts. Sign-in is locked for one week." },
          { status: 429, headers }
        );
      }

      await store.setJSON(key, { failedAttempts } satisfies LoginAttemptRecord);
      return Response.json(
        { ok: false, message: "Incorrect password." },
        { status: 401, headers: responseHeaders(deviceId!, needsDeviceCookie) }
      );
    }

    await store.delete(key);
    return Response.json(
      { ok: true },
      { headers: responseHeaders(deviceId!, needsDeviceCookie, adminCookieHeader(createAdminToken())) }
    );
  } catch {
    return Response.json(
      { ok: false, message: "Unable to sign in right now. Please try again later." },
      { status: 503, headers: responseHeaders(deviceId!, needsDeviceCookie) }
    );
  }
}

export async function DELETE() {
  return Response.json(
    { ok: true },
    { headers: { "Set-Cookie": clearAdminCookieHeader(), "Cache-Control": "no-store" } }
  );
}
