import { NextResponse } from "next/server";

const CORE_BASE = process.env.ROOMIE_CORE_API_BASE_URL;

export async function GET() {
  try {
    if (!CORE_BASE) {
      throw new Error("ROOMIE_CORE_API_BASE_URL is not set");
    }

    // Fetch Stories from Core API
    const res = await fetch(`${CORE_BASE}/api/stories`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data?.ok) {
      throw new Error(data?.error || "Failed to fetch stories from core");
    }

    // ✅ Return array directly to frontend (like old data used to return)
    // data.stories contains:
    // id, title, originalText, refinedText, language, duration, audioUrl, createdAt, ...
    return NextResponse.json(data.stories);
  } catch (error) {
    console.error("❌ Fetch Stories via core Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
