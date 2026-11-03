"use client";

import Link from "next/link";
import useSWR from "swr";
import _ from "lodash";
import Image from "next/image";

import { fetcher } from "@/utils";
import { routes } from "@/routes";
import { API } from "@/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { TournamentLeaderboardCollection } from "@/types";
import { MINUTE } from "@/app/config/intervals";
import { cn } from "@/shared/utils";
import { BG_COLOR_BRONZE, BG_COLOR_GOLD, BG_COLOR_SILVER } from "./contants";

interface TournamentLeaderboardProps {
  tournamentId: string;
  initialLeaderboard: TournamentLeaderboardCollection;
  standingsMap: Map<string, number>;
}

export const TournamentLeaderboard: React.FC<TournamentLeaderboardProps> = ({
  tournamentId,
  initialLeaderboard,
  standingsMap,
}) => {
  const isFinished = standingsMap.size > 0;
  const { data: leaderboard } = useSWR<TournamentLeaderboardCollection | null>(
    isFinished ? null : API.tournaments.leaderboard(tournamentId),
    fetcher,
    {
      fallbackData: initialLeaderboard,
      refreshInterval: isFinished ? 0 : MINUTE,
      revalidateOnFocus: !isFinished,
    },
  );

  if (!leaderboard) {
    return null;
  }

  if (leaderboard.items.length === 0) {
    return "Leaderboard will appear once the tournament starts";
  }

  const getRankClasses = (teamId: string) => {
    const rank = standingsMap.get(teamId);

    switch (rank) {
      case 1:
        return BG_COLOR_GOLD;
      case 2:
        return BG_COLOR_SILVER;
      case 3:
        return BG_COLOR_BRONZE;
      default:
        return "";
    }
  };

  return (
    <div className="grid">
      <Table>
        <TableHeader className="text-center">
          <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead className="min-w-60">TEAM</TableHead>
            <TableHead className="w-20 text-center">POINTS</TableHead>
            <TableHead className="w-20 text-center">SCORED</TableHead>
            <TableHead className="w-20 text-center">CONCEDED</TableHead>
            <TableHead className="w-20 text-center">DIFF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {_.map(leaderboard.items, ({ id, name, points, goalsScored, goalsConceded }, i) => {
            const rank = standingsMap.get(id) ?? i + 1;

            return (
              <TableRow key={id} className={cn("text-center text-lg", getRankClasses(id))}>
                <TableCell>{rank}</TableCell>
                <TableCell>
                  <Link className="flex items-center gap-2" href={routes.teams.details(id)}>
                    <Image src={`/assets/teams/${id}.svg`} width={24} height={24} alt="" />
                    <span>{name}</span>
                  </Link>
                </TableCell>
                <TableCell>{points}</TableCell>
                <TableCell>{goalsScored}</TableCell>
                <TableCell>{goalsConceded}</TableCell>
                <TableCell>{goalsScored - goalsConceded}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
