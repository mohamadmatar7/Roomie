import { NextResponse } from "next/server";

const CORE_BASE = process.env.ROOMIE_CORE_API_BASE_URL;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID" },
        { status: 400 }
      );
    }

    if (!CORE_BASE) {
      throw new Error("ROOMIE_CORE_API_BASE_URL is not set");
    }

    const res = await fetch(
      `${CORE_BASE.replace(/\/$/, "")}/api/schedules/${id}`,
      { method: "DELETE" }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.ok === false) {
      return NextResponse.json(
        { error: data.error || "Failed to delete schedule" },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ /api/schedule/delete via core error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
