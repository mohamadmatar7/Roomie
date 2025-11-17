export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORE_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  try {
    if (!CORE_BASE_URL) {
      console.error("NEXT_PUBLIC_API_BASE_URL is not set");
      return new Response(
        JSON.stringify({ ok: false, error: "Core URL not configured" }),
        { status: 500 }
      );
    }

    const base = CORE_BASE_URL.replace(/\/$/, "");
    const coreRes = await fetch(`${base}/api/player/status`, {
      method: "GET",
      cache: "no-store",
    });

    if (!coreRes.ok) {
      const text = await coreRes.text();
      console.error("Core /api/player/status error:", text);
      return new Response(
        JSON.stringify({ ok: false, error: "Core player status failed" }),
        { status: 502 }
      );
    }

    const data = await coreRes.json();

    return new Response(
      JSON.stringify({
        ok: true,
        isPlaying: Boolean(data.isPlaying),
        currentStoryId:
          typeof data.currentStoryId === "number" ? data.currentStoryId : null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Proxy /api/player/status error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: "Player status error" }),
      { status: 500 }
    );
  }
}
