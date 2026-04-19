import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  try {
    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: body.title as string | undefined,
        description: body.description as string | null | undefined,
        type: body.type as string | undefined,
        date: body.date ? new Date(body.date as string) : undefined,
        endDate: body.endDate ? new Date(body.endDate as string) : null,
        location: body.location as string | null | undefined,
        lecturer: body.lecturer as string | null | undefined,
        isRecurring: body.isRecurring as boolean | undefined,
        recurrence: body.recurrence as string | null | undefined,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "האירוע לא נמצא" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "האירוע לא נמצא" }, { status: 404 });
  }
}
