import jwt from "jsonwebtoken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "x8gTnC9$hFq3rN@7pW";

export async function GET(req) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/roomieToken=([^;]+)/);

    if (!match) {
      return new Response(JSON.stringify({ valid: false }), { status: 401 });
    }

    const token = match[1];
    const payload = jwt.verify(token, JWT_SECRET);

    return new Response(JSON.stringify({ valid: true, payload }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ valid: false, error: err.message }), { status: 401 });
  }
}
