// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET() {
//   try {
//     const stories = await prisma.story.findMany({
//       orderBy: { createdAt: "desc" },
//     });
//     // ✅ safely serialize (avoid Date issues)
//     return NextResponse.json(JSON.parse(JSON.stringify(stories)));
//   } catch (error) {
//     console.error("❌ Fetch Stories Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";

const CORE_BASE = process.env.ROOMIE_CORE_API_BASE_URL;

export async function GET() {
  try {
    if (!CORE_BASE) {
      throw new Error("ROOMIE_CORE_API_BASE_URL is not set");
    }

    // 🔄 نطلب القصص من الـ core
    const res = await fetch(`${CORE_BASE}/api/stories`, {
      method: "GET",
      // ما نخزّن كاش عالسيرفر، بدنا آخر نسخة دائمًا
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data?.ok) {
      throw new Error(data?.error || "Failed to fetch stories from core");
    }

    // ✅ نرجّع array مباشرة للـ frontend (مثل ما كان Prisma يرجّع)
    // data.stories فيها:
    // id, title, originalText, refinedText, language, duration, audioUrl, createdAt, ...
    return NextResponse.json(data.stories);
  } catch (error) {
    console.error("❌ Fetch Stories via core Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
