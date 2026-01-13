import { format } from "date-fns";

import { BaseCard } from "@/shared/BaseCard";
import { cn } from "@/shared/utils";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
  isActive?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isActive }) => {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  return (
    <BaseCard className={cn(isActive && "bg-sky-50 border-sky-700 hover:ring-sky-700")}>
      <div className="flex justify-between">
        <div>{event.name}</div>
      </div>

      <div className="text-gray-500">
        {format(start, "dd MMM yyyy")} – {format(end, "dd MMM yyyy")}
      </div>
    </BaseCard>
  );
};
