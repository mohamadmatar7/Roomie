import { NextResponse } from "next/server";

const CORE_BASE = process.env.ROOMIE_CORE_API_BASE_URL;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, title, text, language } = body;

    if (!id || !title || !text) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    if (!CORE_BASE) {
      throw new Error("ROOMIE_CORE_API_BASE_URL is not set");
    }

    const coreRes = await fetch(`${CORE_BASE}/api/stories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        refinedText: text,   // keeping the same naming convention
        language: language || "en-GB",
      }),
    });

    const coreData = await coreRes.json();

    if (!coreRes.ok || coreData?.ok === false) {
      throw new Error(coreData?.error || "Failed to update story in core");
    }

    const story = coreData.story || coreData;

    return NextResponse.json(story, { status: 200 });
  } catch (error) {
    console.error("❌ Update story via core error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
