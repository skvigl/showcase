import { BaseCard } from "@/shared/BaseCard";
import { format } from "date-fns";
import type { Event } from "@/types";

export type EventCardProps = {
  event: Event;
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  return (
    <BaseCard>
      <div className="flex justify-between">
        <div>{event.name}</div>
      </div>

      <div className="text-gray-500">
        {format(start, "dd MMM yyyy")} – {format(end, "dd MMM yyyy")}
      </div>
    </BaseCard>
  );
};
