import { format } from "date-fns";

import { BaseCard } from "@/shared/BaseCard";
import { cn } from "@/shared/utils";
import type { Tournament } from "@/types";

interface TournamentCardProps {
  tournament: Tournament;
  isActive?: boolean;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, isActive }) => {
  const start = new Date(tournament.startDate);
  const end = new Date(tournament.endDate);

  return (
    <BaseCard className={cn(isActive && "bg-sky-50 border-sky-700 hover:ring-sky-700")}>
      <div className="flex justify-between">
        <div>{tournament.name}</div>
      </div>

      <div className="text-gray-500">
        {format(start, "dd MMM yyyy")} – {format(end, "dd MMM yyyy")}
      </div>
    </BaseCard>
  );
};
