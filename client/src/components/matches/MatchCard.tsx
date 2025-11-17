import Image from "next/image";
import { format } from "date-fns";

import { BaseCard } from "@/shared/BaseCard";
import type { Match } from "@/types";

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  // const isFinished = match.status === "finished";
  const isLive = match.status === "live";
  const isScheduled = match.status === "scheduled";

  const homeSrc = `/teams/${match.home.id}.svg`;
  const awaySrc = `/teams/${match.away.id}.svg`;

  return (
    <>
      <BaseCard className="grid grid-cols-[70%_30%] items-center ">
        <div className="pr-4 border-r border-gray-100">
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
            <div className="overflow-hidden w-8 h-8 rounded-full">
              <Image src={homeSrc} width={32} height={32} alt="" />
            </div>
            <div className="text-lg font-medium truncate">{match.home.name}</div>
            {!isScheduled && <div className="text-xl font-bold">{match.home.score}</div>}
          </div>

          <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center mt-4">
            <div className="overflow-hidden w-8 h-8 rounded-full">
              <Image src={awaySrc} width={32} height={32} alt="" />
            </div>
            <div className="text-lg font-medium truncate">{match.away.name}</div>
            {!isScheduled && <div className="text-xl font-bold">{match.away.score}</div>}
          </div>
        </div>
        <time className="text-center">
          {isLive && "LIVE"}
          <div className="font-bold" suppressHydrationWarning>
            {format(match.date, "dd.MM.yyyy")}
          </div>
          {isScheduled && (
            <div className="font-medium text-gray-500" suppressHydrationWarning>
              {format(match.date, "HH:mm")}
            </div>
          )}
        </time>
      </BaseCard>
    </>
  );
};
