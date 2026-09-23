import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "leaf_admin";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 12;

function getSecret() {
  const secret = process.env.LEAF_ADMIN_PASSWORD;
  if (!secret) throw new Error("LEAF_ADMIN_PASSWORD is not configured.");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createAdminToken() {
  const timestamp = Date.now().toString();
  return `${timestamp}.${sign(timestamp)}`;
}

export function isAdminRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);

  if (!token) return false;

  const [timestamp, signature] = token.split(".");
  if (!timestamp || !signature) return false;

  const age = Date.now() - Number(timestamp);
  if (!Number.isFinite(age) || age < 0 || age > SESSION_LIFETIME_SECONDS * 1000) return false;

  const expected = sign(timestamp);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export function adminCookieHeader(token: string) {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_LIFETIME_SECONDS}`;
}

export function clearAdminCookieHeader() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function normalizeAdminEntry(value: string) {
  return value.trim().replace(/\\s+/g, " ").toUpperCase();
}
