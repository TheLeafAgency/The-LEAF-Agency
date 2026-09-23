import { adminCookieHeader, clearAdminCookieHeader, createAdminToken } from "../../_lib/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = String(body.password || "");
    const expectedPassword = process.env.LEAF_ADMIN_PASSWORD || "";

    if (!expectedPassword || password !== expectedPassword) {
      return Response.json({ ok: false, message: "Incorrect password." }, { status: 401 });
    }

    const token = createAdminToken();
    return Response.json(
      { ok: true },
      { headers: { "Set-Cookie": adminCookieHeader(token) } }
    );
  } catch {
    return Response.json({ ok: false, message: "Unable to sign in." }, { status: 400 });
  }
}

export async function DELETE() {
  return Response.json(
    { ok: true },
    { headers: { "Set-Cookie": clearAdminCookieHeader() } }
  );
}
