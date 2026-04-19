import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(events);
}

type Body = {
  title: string;
  description?: string;
  type: string;
  date: string;
  endDate?: string | null;
  location?: string;
  lecturer?: string;
  isRecurring?: boolean;
  recurrence?: string | null;
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.title || !body?.type || !body?.date) {
    return NextResponse.json(
      { error: "חובה למלא כותרת, סוג ותאריך" },
      { status: 400 },
    );
  }

  const event = await prisma.event.create({
    data: {
      title: body.title,
      description: body.description ?? null,
      type: body.type,
      date: new Date(body.date),
      endDate: body.endDate ? new Date(body.endDate) : null,
      location: body.location ?? null,
      lecturer: body.lecturer ?? null,
      isRecurring: body.isRecurring ?? false,
      recurrence: body.recurrence ?? null,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
