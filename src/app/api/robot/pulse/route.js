import { NextResponse } from "next/server";

const CORE_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req) {
  try {
    if (!CORE_BASE_URL) {
      return NextResponse.json(
        { ok: false, error: "CORE_BASE_URL missing" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const res = await fetch(`${CORE_BASE_URL}/api/robot/pulse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy /api/robot/pulse error:", err);
    return NextResponse.json(
      { ok: false, error: "Proxy error (pulse)" },
      { status: 500 }
    );
  }
}
