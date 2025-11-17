import { NextResponse } from "next/server";

const CORE_BASE = process.env.ROOMIE_CORE_API_BASE_URL;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id"), 10);

    if (!id) {
      return NextResponse.json(
        { error: "Missing story ID" },
        { status: 400 }
      );
    }

    if (!CORE_BASE) {
      console.error("❌ ROOMIE_CORE_API_BASE_URL is not set");
      return NextResponse.json(
        { error: "ROOMIE_CORE_API_BASE_URL is not set" },
        { status: 500 }
      );
    }

    const url = `${CORE_BASE.replace(/\/$/, "")}/api/stories/${id}`;
    console.log("🗑 Deleting story via core:", url);

    const coreRes = await fetch(url, { method: "DELETE" });

    const text = await coreRes.text().catch(() => "");

    if (!coreRes.ok) {
      console.error("❌ Core delete failed:", coreRes.status, text);
      return NextResponse.json(
        { error: `Core error ${coreRes.status}: ${text || "Failed to delete story"}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Delete story via core error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

