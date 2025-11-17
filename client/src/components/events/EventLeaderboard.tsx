"use client";

import Link from "next/link";
import useSWR from "swr";
import _ from "lodash";

import { fetcher } from "@/utils";
import { routes } from "@/routes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import type { TeamWithPoints } from "@/types";

interface EventLeaderboardProps {
  eventId: string;
  initialLeaderboard: TeamWithPoints[];
}

export const EventLeaderboard: React.FC<EventLeaderboardProps> = ({ eventId, initialLeaderboard }) => {
  const { data: leaderboard } = useSWR<TeamWithPoints[]>(`/api/v1/events/${eventId}/leaderboard`, fetcher, {
    fallbackData: initialLeaderboard,
    refreshInterval: 60000,
  });

  return (
    <>
      <Table>
        <TableHeader className="text-center">
          <TableRow>
            <TableHead className="w-4 text-center">#</TableHead>
            <TableHead className="text-center">TEAM</TableHead>
            <TableHead className="w-8 text-center">POINTS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {_.map(leaderboard, (t, i) => {
            return (
              <TableRow key={t.id} className="text-center text-lg">
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <Link href={routes.teams.details(t.id)}>{t.name}</Link>
                </TableCell>
                <TableCell>{t.points}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
