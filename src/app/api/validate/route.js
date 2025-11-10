export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_TOKENS = new Set(); // temporary in-memory token store

export function addToken(token) {
  VALID_TOKENS.add(token);
  setTimeout(() => VALID_TOKENS.delete(token), 1000 * 60 * 60 * 24); // expire after 24h
}

export async function POST(request) {
  const { token } = await request.json();
  if (VALID_TOKENS.has(token)) {
    return new Response(JSON.stringify({ valid: true }), { status: 200 });
  }
  return new Response(JSON.stringify({ valid: false }), { status: 401 });
}
