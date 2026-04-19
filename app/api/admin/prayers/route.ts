import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type PrayerInput = {
  name: string;
  time: string;
  notes?: string | null;
};

type Body = {
  profileId: string;
  prayers: PrayerInput[];
};

/**
 * Replace all prayers for a profile with the supplied list.
 * Simpler than per-prayer diffing: profile is always the whole list.
 */
export async function PUT(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.profileId || !Array.isArray(body.prayers)) {
    return NextResponse.json(
      { error: "profileId ו-prayers הם שדות חובה" },
      { status: 400 },
    );
  }

  const profile = await prisma.prayerProfile.findUnique({
    where: { id: body.profileId },
  });
  if (!profile) {
    return NextResponse.json({ error: "פרופיל לא נמצא" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.prayer.deleteMany({ where: { profileId: body.profileId } }),
    prisma.prayerProfile.update({
      where: { id: body.profileId },
      data: {
        prayers: {
          create: body.prayers
            .filter((p) => p.name && p.time)
            .map((p, i) => ({
              name: p.name,
              time: p.time,
              order: i + 1,
              notes: p.notes ?? null,
            })),
        },
      },
    }),
  ]);

  const updated = await prisma.prayerProfile.findUnique({
    where: { id: body.profileId },
    include: { prayers: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(updated);
}
