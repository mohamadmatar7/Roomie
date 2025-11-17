// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";


// export async function POST(req) {
//   try {
//     const { title, text } = await req.json();
//     if (!title || !text)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     // ✨ Enhance the story text for smooth voice narration
//     const prompt = `
// You are a storytelling editor.
// Prepare this story for smooth spoken narration.
// - Do NOT translate it.
// - Keep the story exactly as is.
// - Only fix punctuation, rhythm, and flow.
// Return only the improved version in the same language.
// ---
// ${text}
// ---
// `;

//     const res = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [{ role: "user", content: prompt }],
//         temperature: 0.4,
//       }),
//     });

//     const data = await res.json();
//     const refined = data.choices?.[0]?.message?.content?.trim() || text;

//     // 🌍 Detect language
//     let language = "en-GB";
//     const lower = text.toLowerCase();
//     if (/[أ-ي]/.test(text)) language = "ar-SA";
//     else if (/de |het |een |zijn|bos|leeuw/.test(lower)) language = "nl-NL";
//     else if (/the |and |once upon/.test(lower)) language = "en-GB";

//     // 💾 Save the story in your schema fields
//     const story = await prisma.story.create({
//       data: {
//         title: title.trim(),
//         originalText: text,
//         refinedText: refined,
//         language,
//         audioUrl: null,
//       },
//     });

//     console.log("✅ Story saved:", story.title, "-", story.language);
//     return NextResponse.json(story, { status: 201 });
//   } catch (error) {
//     console.error("❌ Add Story Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";

const CORE_BASE = process.env.ROOMIE_CORE_API_BASE_URL;

export async function POST(req) {
  try {
    const { title, text, language: clientLang } = await req.json();

    if (!title || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Prompt to enhance the story text for smooth voice narration
    const prompt = `
You are a storytelling editor.
Prepare this story for smooth spoken narration.
- Do NOT translate it.
- Keep the story exactly as is.
- Only fix punctuation, rhythm, and flow.
Return only the improved version in the same language.
---
${text}
---
`;

    // Request text enhancement from OpenAI (server-side, key not exposed to frontend)
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    });

    const data = await res.json();
    const refined = data.choices?.[0]?.message?.content?.trim() || text;

    // 🌍 Detect language (same old logic)
    let language = clientLang || "en-GB";
    const lower = text.toLowerCase();
    if (/[أ-ي]/.test(text)) language = "ar-SA";
    else if (/de |het |een |zijn|bos|leeuw/.test(lower)) language = "nl-NL";
    else if (/the |and |once upon/.test(lower)) language = "en-GB";

    if (!CORE_BASE) {
      throw new Error("ROOMIE_CORE_API_BASE_URL is not set");
    }

    // 📝 Send the story to roomie-core to save it in SQLite
    const coreRes = await fetch(`${CORE_BASE}/api/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        originalText: text,
        refinedText: refined,
        language,
        // voice / duration / audioUrl ممكن نملّيهم لاحقاً لما نضيف TTS من core
      }),
    });

    const coreData = await coreRes.json();

    if (!coreRes.ok || !coreData?.ok) {
      throw new Error(coreData?.error || "Failed to create story in core");
    }

    // 🔁 بعض الأحيان الـ core ممكن يرجّع:
    // { ok: true, story: {...} } أو يرجّع {...} مباشرة
    const story = coreData.story || coreData;

    console.log("✅ Story saved in core:", story.title, "-", story.language);

    // ⚠️ مهم: نرجّع الـ story object نفسه للـ frontend،
    // لأن StoriesTab تتوقع data.id / data.title / data.refinedText / data.originalText / data.createdAt
    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("❌ Add Story Error (via core):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
