import { NextResponse } from "next/server";

const CORE_BASE = process.env.ROOMIE_CORE_API_BASE_URL;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE() {
  try {
    if (!CORE_BASE) {
      throw new Error("ROOMIE_CORE_API_BASE_URL is not set");
    }

    const res = await fetch(
      `${CORE_BASE.replace(/\/$/, "")}/api/schedules`,
      { method: "DELETE" }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.ok === false) {
      return NextResponse.json(
        { error: data.error || "Failed to clear schedules" },
        { status: res.status || 500 }
      );
    }

    // ✅ Return an empty list (no schedules left)
    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error("❌ /api/schedule/clear via core error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
