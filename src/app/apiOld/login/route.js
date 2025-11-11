import bcrypt from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Local fallback credentials for development
const USERNAME = process.env.LOGIN_USERNAME || "admin";
const HASHED_PASSWORD = process.env.LOGIN_PASSWORD_HASH || "$2b$10$FjPRVtbTjXZlEyhQ5osfNOPlk.9ayOJXao2MLtH2dmypMEimb4xDe";


console.log("✅ Login API route loaded");
console.log("👉 USERNAME from env:", USERNAME);
console.log("👉 HASHED_PASSWORD starts with:", HASHED_PASSWORD?.slice(0, 20));

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    console.log("➡️ Incoming credentials:", username, password);

    // --- Username check ---
    if (username !== USERNAME) {
      console.log("❌ Username mismatch");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid credentials" }),
        { status: 401 }
      );
    }

const normalizedHash = HASHED_PASSWORD.replace(/^\$2b\$/, "$2a$");
const match = await bcrypt.compare(password, normalizedHash);
    console.log("🔐 bcrypt result:", match);

    if (!match) {
      console.log("❌ Password mismatch");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid credentials" }),
        { status: 401 }
      );
    }

    // --- Generate token ---
    const token = Math.random().toString(36).substring(2);
    console.log("✅ Login success for:", username);

    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("💥 Login error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500 }
    );
  }
}
