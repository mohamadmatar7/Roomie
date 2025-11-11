import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

console.log("Env check:", {
  hasUser: !!process.env.ADMIN_USER,
  hasHash: !!process.env.ADMIN_PASS_HASH,
  user: process.env.ADMIN_USER,
  hashLength: process.env.ADMIN_PASS_HASH?.length,
  jwtSecret: process.env.ADMIN_JWT_SECRET,
  jwtExpires: process.env.ADMIN_JWT_EXPIRES,
});
// ✅ Read from .env
const USERNAME = process.env.ADMIN_USER;
const HASHED_PASSWORD = process.env.ADMIN_PASS_HASH;
const JWT_SECRET = process.env.ADMIN_JWT_SECRET;
const JWT_EXPIRES = process.env.ADMIN_JWT_EXPIRES;

console.log("🔐 Login API loaded");
console.log("👉 USERNAME =", USERNAME);
console.log("👉 HASHED_PASSWORD starts with =", HASHED_PASSWORD?.slice(0, 20));

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const matchUser = username === USERNAME;
    const matchPass = await bcrypt.compare(password, HASHED_PASSWORD);

    if (!matchUser || !matchPass) {
      return new Response(JSON.stringify({ success: false, error: "Invalid credentials" }), {
        status: 401,
      });
    }

    // Create JWT
    const token = jwt.sign({ user: username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    // Return token (frontend sets cookie)
    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
  }
}
