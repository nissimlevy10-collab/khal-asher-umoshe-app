import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EventForm } from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] mb-4">
        עריכת אירוע
      </h1>
      <EventForm
        initial={{
          id: event.id,
          title: event.title,
          description: event.description,
          type: event.type,
          date: event.date,
          location: event.location,
          lecturer: event.lecturer,
          isRecurring: event.isRecurring,
          recurrence: event.recurrence,
        }}
      />
    </div>
  );
}
