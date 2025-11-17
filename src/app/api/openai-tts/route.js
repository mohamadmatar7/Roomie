// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import prisma from "@/lib/prisma";

// export async function POST(req) {
//   try {
//     const { text, lang, voice, storyId } = await req.json();

//     console.log("🟢 /api/openai-tts received:", {
//       storyId,
//       lang,
//       voice,
//       textLength: text ? text.length : 0,
//       textPreview: text ? text.slice(0, 80) + "..." : "(no text)",
//     });

//     if (!text || text.trim().length < 3)
//       return NextResponse.json({ error: "Missing text" }, { status: 400 });

//     // 1️⃣ Fetch story info
//     let story = null;
//     if (storyId) {
//       const storyNum = Number(storyId);
//       story = await prisma.story.findFirst({
//         where: { id: storyNum },
//         select: {
//           id: true,
//           title: true,
//           originalText: true,
//           refinedText: true,
//           language: true,
//           audioUrl: true,
//         },
//       });
//       if (story) {
//         console.log("🎯 Loaded story:", story.title, "| Language:", story.language);
//       } else {
//         console.warn("⚠️ Story not found for ID:", storyNum);
//       }
//     }

//     const storyTitle = story?.title?.trim() || "story";

//     // 2️⃣ Normalize language
//     let storyLang = story?.language || lang || "en-GB";
//     storyLang = storyLang.toString().trim().toLowerCase();
//     if (storyLang.startsWith("ar")) storyLang = "ar-SA";
//     else if (storyLang.startsWith("nl")) storyLang = "nl-NL";
//     else if (storyLang.startsWith("en")) storyLang = "en-GB";
//     else storyLang = "en-GB";

//     console.log("🧠 Final normalized language →", storyLang);

//     // 3️⃣ Prepare filenames
//     const safeTitle = storyTitle.replace(/[^\p{L}\p{N}_-]+/gu, "_").toLowerCase();
//     const uniqueId = storyId
//       ? `id${storyId}`
//       : Buffer.from(text).toString("base64").slice(0, 6);
//     const fileName = `${safeTitle}_${uniqueId}.mp3`;
//     const fileDir = path.join(process.cwd(), "public", "audio");
//     const filePath = path.join(fileDir, fileName);
//     const relativeUrl = `/audio/${fileName}`;

//     await fs.promises.mkdir(fileDir, { recursive: true });

//     // 4️⃣ Use cached audio if available — hard exit immediately
//     if (story?.audioUrl) {
//       const dbPath = path.join(process.cwd(), "public", story.audioUrl);
//       try {
//         if (fs.existsSync(dbPath)) {
//           const stats = await fs.promises.stat(dbPath);
//           if (stats.size > 1024) {
//             console.log("🎧 Cached audio found →", story.audioUrl);
//             const buffer = await fs.promises.readFile(dbPath);

//             // 🛑 HARD EXIT HERE
//             return new Response(buffer, {
//               headers: { "Content-Type": "audio/mpeg" },
//             });
//           } else {
//             console.warn("⚠️ Cached file too small, regenerating...");
//           }
//         }
//       } catch (err) {
//         console.error("⚠️ Cache read error:", err);
//       }
//     }

//     // 5️⃣ Voice config
//     const config = {
//       "en-GB": { modelVoice: voice || "fable" },
//       "nl-NL": { modelVoice: voice || "verse" },
//       "ar-SA": { modelVoice: voice || "nova" },
//       default: { modelVoice: voice || "alloy" },
//     };
//     const settings = config[storyLang] || config.default;

//     // 6️⃣ Choose text
//     let finalText = story?.refinedText || story?.originalText || text;

//     // 7️⃣ Light refinement
//     const refinePrompt = `
// Keep the same language (${storyLang}). 
// Do NOT translate. 
// Fix punctuation for clear spoken delivery.
// ---
// ${finalText}
// ---`;

//     try {
//       const refineRes = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "gpt-4o-mini",
//           messages: [{ role: "user", content: refinePrompt }],
//           temperature: 0.2,
//         }),
//       });

//       const refineData = await refineRes.json();
//       const improved = refineData.choices?.[0]?.message?.content?.trim();
//       if (improved && improved.length > 5) {
//         finalText = improved;
//         console.log("📝 Text refined successfully.");
//       }
//     } catch (err) {
//       console.warn("⚠️ Refinement skipped:", err.message);
//     }

//     // 8️⃣ Generate speech (OpenAI)
//     console.log(`🧠 Using language → ${storyLang}`);
//     const ttsRes = await fetch("https://api.openai.com/v1/audio/speech", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini-tts",
//         voice: settings.modelVoice,
//         input: finalText,
//         format: "mp3",
//       }),
//     });

//     if (!ttsRes.ok) {
//       const err = await ttsRes.text();
//       console.error("❌ TTS error:", err);
//       return NextResponse.json({ error: err }, { status: 400 });
//     }

//     const buffer = Buffer.from(await ttsRes.arrayBuffer());

//     // 9️⃣ Save new audio
//     await fs.promises.writeFile(filePath, buffer);
//     if (storyId) {
//       await prisma.story.update({
//         where: { id: storyId },
//         data: { audioUrl: relativeUrl },
//       });
//     }
//     console.log("✅ Audio generated & cached →", relativeUrl);

//     return new Response(buffer, { headers: { "Content-Type": "audio/mpeg" } });
//   } catch (error) {
//     console.error("❌ Fatal OpenAI TTS Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


// import { NextResponse } from "next/server";

// const CORE_BASE = process.env.ROOMIE_CORE_API_BASE_URL;

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     if (!CORE_BASE) {
//       throw new Error("ROOMIE_CORE_API_BASE_URL is not set");
//     }

//     const res = await fetch(
//       `${CORE_BASE.replace(/\/$/, "")}/api/tts`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       }
//     );

//     const data = await res.json().catch(() => ({}));

//     if (!res.ok || data.ok === false) {
//       return NextResponse.json(
//         { error: data.error || "TTS failed" },
//         { status: res.status || 500 }
//       );
//     }

//     // { ok: true, audioUrl: "/media/audio/....mp3" }
//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     console.error("❌ /api/openai-tts proxy error:", error);
//     return NextResponse.json(
//       { error: error.message || "Server error" },
//       { status: 500 }
//     );
//   }
// }
