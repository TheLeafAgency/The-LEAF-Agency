import { createHash, randomUUID } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { adminCookieHeader, clearAdminCookieHeader, createAdminToken } from "../../_lib/admin";

const MAX_FAILED_ATTEMPTS = 5;
const COOLDOWN_MS = 30 * 60 * 60 * 1000;
const MAX_IP_FAILED_ATTEMPTS = 10;
const IP_COOLDOWN_MS = 30 * 60 * 1000;
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

function getClientIp(request: Request) {
  // Only trust Netlify's client-IP header. x-forwarded-for can contain
  // client-supplied values and should not be used as a security identity.
  return request.headers.get("x-nf-client-connection-ip")?.trim() || "";
}

export async function POST(request: Request) {
  const savedDeviceId = readCookie(request, DEVICE_COOKIE);
  const validDeviceId = savedDeviceId && /^[0-9a-f-]{36}$/i.test(savedDeviceId);
  const needsDeviceCookie = !validDeviceId;
  let deviceId = validDeviceId ? savedDeviceId : randomUUID();

  // Each browser profile receives its own random identifier. A new device's
  // failed attempts won't lock out another device sharing the same Wi-Fi.

  try {
    const body = await request.json();
    const password = String(body.password || "");
    const expectedPassword = process.env.LEAF_ADMIN_PASSWORD || "";
    const store = rateLimitStore();
    const key = `login:${deviceKey(deviceId)}`;
    const clientIp = getClientIp(request);
    const ipKey = clientIp ? `login-ip:${deviceKey(clientIp)}` : null;
    const now = Date.now();

    let record = (await store.get(key, { type: "json" })) as LoginAttemptRecord | null;
    let ipRecord = ipKey
      ? ((await store.get(ipKey, { type: "json" })) as LoginAttemptRecord | null)
      : null;

    if (ipRecord?.lockedUntil && now < ipRecord.lockedUntil) {
      const retryAfter = Math.ceil((ipRecord.lockedUntil - now) / 1000);
      const headers = responseHeaders(deviceId!, needsDeviceCookie);
      headers.set("Retry-After", String(retryAfter));
      return Response.json(
        { ok: false, message: "Too many sign-in attempts from this network. Please wait before trying again." },
        { status: 429, headers }
      );
    }

    if (ipRecord?.lockedUntil && now >= ipRecord.lockedUntil && ipKey) {
      ipRecord = null;
      await store.delete(ipKey);
    }

    if (record?.lockedUntil && now < record.lockedUntil) {
      const retryAfter = Math.ceil((record.lockedUntil - now) / 1000);
      return Response.json(
        { ok: false, message: "Too many incorrect attempts. Sign-in is locked for 30 hours." },
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
      const ipFailedAttempts = (ipRecord?.failedAttempts || 0) + 1;

      if (ipKey) {
        if (ipFailedAttempts >= MAX_IP_FAILED_ATTEMPTS) {
          const lockedUntil = now + IP_COOLDOWN_MS;
          await store.setJSON(ipKey, { failedAttempts: ipFailedAttempts, lockedUntil } satisfies LoginAttemptRecord);
        } else {
          await store.setJSON(ipKey, { failedAttempts: ipFailedAttempts } satisfies LoginAttemptRecord);
        }
      }

      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockedUntil = now + COOLDOWN_MS;
        await store.setJSON(key, { failedAttempts, lockedUntil } satisfies LoginAttemptRecord);
        const headers = responseHeaders(deviceId!, needsDeviceCookie);
        headers.set("Retry-After", String(Math.ceil(COOLDOWN_MS / 1000)));
        return Response.json(
          { ok: false, message: "Too many incorrect attempts. Sign-in is locked for 30 hours." },
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
    if (ipKey) await store.delete(ipKey);
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
