export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Set-Cookie": "roomieToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
      "Content-Type": "application/json",
    },
  });
}
