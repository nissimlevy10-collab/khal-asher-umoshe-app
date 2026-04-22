import { config } from "dotenv";
config(); // load .env before anything else

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Settings (singleton)
  const initialPasscode = process.env.INITIAL_ADMIN_PASSCODE ?? "1234";
  const hashedPasscode = await bcrypt.hash(initialPasscode, 10);

  await prisma.settings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      synagogueName: "בית הכנסת הספרדי המרכזי היכל אשר ומשה",
      address: "רמת בית שמש ד׳, בית שמש",
      latitude: 31.7489,
      longitude: 34.985,
      timezone: "Asia/Jerusalem",
      adminPasscode: hashedPasscode,
      contactPhone: "",
      contactEmail: "",
      aboutText:
        "בית הכנסת הספרדי המרכזי 'היכל אשר ומשה' הוא בית כנסת קהילתי בשכונת רמת בית שמש ד׳. מזמינים אתכם לבוא להתפלל ולהשתתף בשיעורים ובפעילויות.",
      donationUrl: "https://nedar.im/7011010",
      donationNote: "להעברת תרומות ותשלום נדבות ניתן בנדרים פלוס בקישור או בהעברה בנקאית.",
      bankName: "בנק מרכנתיל",
      bankBranch: "725",
      bankAccount: "41193",
      bankAccountName: "היכל אשר ומשה",
      youtubeUrl: "https://www.youtube.com/channel/UCbx9Zv-wtFJE0le55suPgrQ",
    },
    update: {},
  });
  console.log("✅ Settings seeded");

  // 2. Prayer Profiles
  const profiles = [
    {
      type: "WEEKDAY",
      name: "ימי חול",
      prayers: [
        // ימי חול — יתווספו על ידי הגבאים דרך הדשבורד כשיפתח מניין
        // כאשר יוסיפו: מנחה = zmanimBase:"sunset", offsetMinutes:-20 (מנחה קטנה)
        // ערבית = מיד אחרי מנחה (אותו זמן)
      ] as Array<{
        name: string; time: string; order: number;
        notes?: string; zmanimBase?: string; offsetMinutes?: number;
      }>,
    },
    {
      type: "FRIDAY",
      name: "ערב שבת",
      prayers: [
        { name: "שחרית א׳", time: "05:30", order: 1 },
        { name: "שחרית ב׳", time: "07:00", order: 2 },
        {
          name: "מנחה וקבלת שבת",
          time: "19:00",
          order: 3,
          notes: "25 דקות לפני שקיעה",
          zmanimBase: "sunset",
          offsetMinutes: -25,
        },
      ],
    },
    {
      type: "SHABBAT",
      name: "שבת",
      prayers: [
        {
          name: "שחרית מניין א׳ נץ החמה",
          time: "05:00",
          order: 1,
          notes: "שעה לפני הנץ המישורי",
          zmanimBase: "seaLevelSunrise",
          offsetMinutes: -60,
        },
        {
          name: "שחרית מניין ב׳",
          time: "08:00",
          order: 2,
        },
        {
          name: "תהילים לבנים",
          time: "15:30",
          order: 3,
          notes: "3.5 שעות לפני שקיעה",
          zmanimBase: "sunset",
          offsetMinutes: -210,
        },
        {
          name: "לימוד אבות ובנים",
          time: "16:30",
          order: 4,
          notes: "2 שעות לפני שקיעה",
          zmanimBase: "sunset",
          offsetMinutes: -120,
        },
        {
          name: "מנחה",
          time: "17:30",
          order: 5,
          notes: "שעה לפני שקיעה",
          zmanimBase: "sunset",
          offsetMinutes: -60,
        },
        {
          name: "ערבית מניין א׳ מוצ״ש",
          time: "20:00",
          order: 6,
          notes: "בצאת השבת",
          zmanimBase: "tzeit",
          offsetMinutes: 0,
        },
        {
          name: "ערבית מניין ב׳",
          time: "20:15",
          order: 7,
          notes: "רבע שעה אחרי צאת השבת",
          zmanimBase: "tzeit",
          offsetMinutes: 15,
        },
      ],
    },
    {
      type: "HOLIDAY",
      name: "חגים",
      prayers: [
        { name: "שחרית", time: "08:00", order: 1 },
        {
          name: "מנחה",
          time: "17:30",
          order: 2,
          notes: "שעה לפני שקיעה",
          zmanimBase: "sunset",
          offsetMinutes: -60,
        },
        {
          name: "ערבית",
          time: "20:00",
          order: 3,
          notes: "מיד אחרי מנחה",
          zmanimBase: "tzeit",
          offsetMinutes: 0,
        },
      ],
    },
  ];

  for (const profile of profiles) {
    const existing = await prisma.prayerProfile.findUnique({
      where: { type: profile.type },
    });
    if (existing) {
      // Delete old prayers and re-seed
      await prisma.prayer.deleteMany({ where: { profileId: existing.id } });
      await prisma.prayerProfile.update({
        where: { id: existing.id },
        data: {
          name: profile.name,
          prayers: {
            create: profile.prayers.map((p) => ({
              name: p.name,
              time: p.time,
              order: p.order,
              notes: p.notes ?? null,
              zmanimBase: p.zmanimBase ?? null,
              offsetMinutes: p.offsetMinutes ?? 0,
            })),
          },
        },
      });
    } else {
      await prisma.prayerProfile.create({
        data: {
          type: profile.type,
          name: profile.name,
          prayers: {
            create: profile.prayers.map((p) => ({
              name: p.name,
              time: p.time,
              order: p.order,
              notes: p.notes ?? null,
              zmanimBase: p.zmanimBase ?? null,
              offsetMinutes: p.offsetMinutes ?? 0,
            })),
          },
        },
      });
    }
  }
  console.log("✅ Prayer profiles seeded");

  // 3. Sample events
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const events = [
    {
      title: "שיעור בהלכה יומית",
      description: "שיעור יומי על הלכות בחיי היום-יום",
      type: "LESSON",
      date: tomorrow,
      location: "בית הכנסת - אולם מרכזי",
      lecturer: "הרב יוסף כהן",
      isRecurring: true,
      recurrence: "weekly",
    },
    {
      title: "שיעור בפרשת השבוע",
      description: "שיעור מעמיק בפרשת השבוע",
      type: "LESSON",
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      location: "בית הכנסת - אולם מרכזי",
      lecturer: "הרב אברהם לוי",
      isRecurring: true,
      recurrence: "weekly",
    },
    {
      title: "קידוש קהילתי",
      description: "קידוש חגיגי לאחר תפילת שחרית של שבת",
      type: "COMMUNITY",
      date: nextWeek,
      location: "בית הכנסת - אולם האירועים",
    },
  ];

  // clear existing and re-seed for a clean dev state
  await prisma.event.deleteMany({});
  for (const e of events) {
    await prisma.event.create({ data: e });
  }
  console.log("✅ Sample events seeded");

  console.log("🎉 Seed complete!");
  console.log(`🔑 Initial admin passcode: ${initialPasscode}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
