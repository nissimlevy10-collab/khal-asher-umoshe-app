import { EventForm } from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--primary)] mb-4">
        הוספת אירוע חדש
      </h1>
      <EventForm />
    </div>
  );
}
