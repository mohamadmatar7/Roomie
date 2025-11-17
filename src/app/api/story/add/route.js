import { NextResponse } from "next/server";

const CORE_BASE = process.env.ROOMIE_CORE_API_BASE_URL;

export async function POST(req) {
  try {
    const { title, text, language: clientLang, audioUrl } = await req.json();

    const trimmedTitle = title?.trim();
    const trimmedText = text?.trim?.() || "";
    const trimmedAudioUrl = audioUrl?.trim?.() || "";

    // Should have title
    // Should have either text or audio (URL)
    if (!trimmedTitle || (!trimmedText && !trimmedAudioUrl)) {
      return NextResponse.json(
        { error: "Titel + (tekst of audio) vereist" },
        { status: 400 }
      );
    }

    let refined = null;

    // 📝 Do refinement only if there is actual text
    if (trimmedText) {
      const prompt = `
You are a storytelling editor.
Prepare this story for smooth spoken narration.
- Do NOT translate it.
- Keep the story exactly as is.
- Only fix punctuation, rhythm, and flow.
Return only the improved version in the same language.
---
${trimmedText}
---
`;

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
      refined = data.choices?.[0]?.message?.content?.trim() || trimmedText;
    }

    // 🌍 Detect language (same old logic, but only if there is text)
    let language = clientLang || "en-GB";
    if (trimmedText) {
      const lower = trimmedText.toLowerCase();
      if (/[أ-ي]/.test(trimmedText)) language = "ar-SA";
      else if (/de |het |een |zijn|bos|leeuw/.test(lower)) language = "nl-NL";
      else if (/the |and |once upon/.test(lower)) language = "en-GB";
    }

    if (!CORE_BASE) {
      throw new Error("ROOMIE_CORE_API_BASE_URL is not set");
    }

    // 📝 Send the story to roomie-core to save it in SQLite
    const coreRes = await fetch(`${CORE_BASE}/api/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: trimmedTitle,
        originalText: trimmedText || null,
        refinedText: refined || null,
        language,
        audioUrl: trimmedAudioUrl || null, // 🆕 Pass the MP3 URL if available
        // story_type might still be determined by core based on what's provided
      }),
    });

    const coreData = await coreRes.json();

    if (!coreRes.ok || !coreData?.ok) {
      throw new Error(coreData?.error || "Failed to create story in core");
    }

    // 🔁 Sometimes core might return:
    // { ok: true, story: {...} } or {...} directly
    const story = coreData.story || coreData;

    console.log("✅ Story saved in core:", story.title, "-", story.language);

    // ⚠️ Important: return the same story object to the frontend,
    // because StoriesTab expects data.id / data.title / data.refinedText / data.originalText / data.createdAt / (audioUrl)
    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("❌ Add Story Error (via core):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
