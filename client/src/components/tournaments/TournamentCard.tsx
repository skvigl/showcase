import { format } from "date-fns";

import { BaseCard } from "@/shared/BaseCard";
import { cn } from "@/shared/utils";
import { Tournament } from "@/types";
import { TournamentLogo } from "./TournamentLogo";
import { getSeason } from "./utils";

interface TournamentCardProps {
  tournament: Tournament;
  isActive?: boolean;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, isActive }) => {
  const start = new Date(tournament.startDate);
  const end = new Date(tournament.endDate);
  const season = getSeason(start);

  return (
    <BaseCard className={cn("flex items-center gap-4", isActive && "bg-sky-50 border-sky-700 hover:ring-sky-700")}>
      <TournamentLogo season={season} name={tournament.name} year={start.getFullYear()} size="md" bordered={false} />

      <div className="flex flex-col justify-center min-w-0">
        <div className="font-bold text-slate-900 text-base leading-snug truncate">{tournament.name}</div>
        <div className="text-gray-500 text-sm">
          {format(start, "dd MMM yyyy")} – {format(end, "dd MMM yyyy")}
        </div>
      </div>
    </BaseCard>
  );
};
