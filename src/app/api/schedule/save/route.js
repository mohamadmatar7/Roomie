import { NextResponse } from "next/server";

const CORE_BASE = process.env.ROOMIE_CORE_API_BASE_URL;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { storyId, date, time } = body || {};

    if (!CORE_BASE) {
      throw new Error("ROOMIE_CORE_API_BASE_URL is not set");
    }

    const res = await fetch(
      `${CORE_BASE.replace(/\/$/, "")}/api/schedules`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, date, time }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.ok === false) {
      return NextResponse.json(
        { error: data.error || "Failed to save schedule" },
        { status: res.status || 400 }
      );
    }

    return NextResponse.json(data.schedules || [], { status: 200 });
  } catch (error) {
    console.error("❌ /api/schedule/save via core error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
