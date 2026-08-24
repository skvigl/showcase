"use client";

import Link from "next/link";
import useSWR from "swr";
import _ from "lodash";
import Image from "next/image";

import { fetcher } from "@/utils";
import { routes } from "@/routes";
import { API } from "@/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import type { TournamentLeaderboard as TTournamentLeaderboard } from "@/types";
import { MINUTE } from "@/app/config/intervals";

interface TournamentLeaderboardProps {
  tournamentId: string;
  initialLeaderboard: TTournamentLeaderboard;
}

export const TournamentLeaderboard: React.FC<TournamentLeaderboardProps> = ({ tournamentId, initialLeaderboard }) => {
  const { data: leaderboard } = useSWR<TTournamentLeaderboard | null>(
    API.tournaments.leaderboard(tournamentId),
    fetcher,
    {
      fallbackData: initialLeaderboard,
      refreshInterval: MINUTE,
    },
  );

  if (!leaderboard) {
    return null;
  }

  return (
    <div className="grid">
      <Table>
        <TableHeader className="text-center">
          <TableRow>
            <TableHead className="w-4 text-center">#</TableHead>
            <TableHead className="min-w-60">TEAM</TableHead>
            <TableHead className="w-20 text-center">POINTS</TableHead>
            <TableHead className="w-20 text-center">SCORED</TableHead>
            <TableHead className="w-20 text-center">CONSEDED</TableHead>
            <TableHead className="w-20 text-center">DIFF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {_.map(leaderboard.items, ({ id, name, points, goalsScored, goalsConceded }, i) => {
            return (
              <TableRow key={id} className="text-center text-lg">
                <TableCell>{i + 1}</TableCell>
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
