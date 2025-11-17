import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";

const AUDIO_DIR = path.join(process.cwd(), "public", "audio");
const DAYS_LIMIT = 30;

export async function GET() {
  try {
    console.log("🧹 Starting cleanup of old audio files...");

    const now = new Date();
    const cutoff = new Date(now.getTime() - DAYS_LIMIT * 24 * 60 * 60 * 1000);

    // 🗂️ Fetch all stories with valid audio files still in use
    const activeStories = await prisma.story.findMany({
      select: { audioUrl: true },
      where: { audioUrl: { not: null } },
    });

    const activeFiles = new Set(
      activeStories.map((s) => s.audioUrl.split("/").pop())
    );

    const files = await fs.promises.readdir(AUDIO_DIR);
    let deleted = 0;

    for (const file of files) {
      const filePath = path.join(AUDIO_DIR, file);
      const stats = await fs.promises.stat(filePath);

      const fileAgeDays = (now - stats.mtime) / (1000 * 60 * 60 * 24);
      const isActive = activeFiles.has(file);

      if (!isActive && fileAgeDays > DAYS_LIMIT) {
        await fs.promises.unlink(filePath);
        deleted++;
        console.log(`🗑️ Deleted old unused file: ${file}`);
      }
    }

    console.log(`✅ Cleanup finished — ${deleted} file(s) deleted.`);
    return NextResponse.json({ success: true, deleted });
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
