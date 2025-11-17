// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function POST(req) {
//   try {
//     const { storyId, date, time } = await req.json();

//     if (!storyId || !date || !time)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     const scheduleDate = new Date(date);
//     const [hours, minutes] = time.split(":").map(Number);
//     scheduleDate.setHours(hours);
//     scheduleDate.setMinutes(minutes);

//     const now = new Date();

//     // 🚫 Past check
//     if (scheduleDate < now) {
//       return NextResponse.json(
//         { error: "You cannot schedule for the past." },
//         { status: 400 }
//       );
//     }

//     // 🚫 Duplicate check (same day + same time)
//     const startOfDay = new Date(scheduleDate);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(scheduleDate);
//     endOfDay.setHours(23, 59, 59, 999);

//     const existing = await prisma.schedule.findFirst({
//       where: {
//         AND: [
//           { date: { gte: startOfDay.toISOString(), lte: endOfDay.toISOString() } },
//           { time },
//         ],
//       },
//     });

//     if (existing) {
//       return NextResponse.json(
//         { error: "Er bestaat al een planning op deze datum en tijd ⏰" },
//         { status: 400 }
//       );
//     }

//     // ✅ Create new schedule
//     const result = await prisma.schedule.create({
//       data: {
//         storyId: Number(storyId),
//         date: scheduleDate.toISOString(),
//         time,
//       },
//       include: { story: true },
//     });

//     // 🧹 Remove expired plans
//     await prisma.schedule.deleteMany({
//       where: { date: { lt: new Date().toISOString() } },
//     });

//     // ✅ Return updated upcoming schedules
//     const updatedSchedules = await prisma.schedule.findMany({
//       where: { date: { gte: new Date().toISOString() } },
//       orderBy: { date: "asc" },
//       include: { story: true },
//     });

//     return NextResponse.json(updatedSchedules);
//   } catch (error) {
//     console.error("❌ Schedule save error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";

const CORE_BASE = process.env.ROOMIE_CORE_API_BASE_URL;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { storyId, date, time } = body || {};

    if (!CORE_BASE) {
      throw new Error("ROOMIE_CORE_API_BASE_URL is not set");
    }

    const res = await fetch(
      `${CORE_BASE.replace(/\/$/, "")}/api/schedules`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, date, time }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.ok === false) {
      return NextResponse.json(
        { error: data.error || "Failed to save schedule" },
        { status: res.status || 400 }
      );
    }

    return NextResponse.json(data.schedules || [], { status: 200 });
  } catch (error) {
    console.error("❌ /api/schedule/save via core error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
