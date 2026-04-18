"use client";

import Link from "next/link";
import _ from "lodash";
import useSWR from "swr";

import { Section } from "@/shared/Section";
import { routes } from "@/routes";
import { fetcher } from "@/utils";
import { API } from "@/api";
import { TeamCard } from "@/components/teams/TeamCard";
import { MINUTE } from "@/app/config/intervals";
import type { TournamentLeaderboard } from "@/types";

interface TournamentTopTeamsProps {
  tournamentId: string;
  initialTopTeams: TournamentLeaderboard;
}

export const TournamentTopTeams: React.FC<TournamentTopTeamsProps> = ({ tournamentId, initialTopTeams }) => {
  const { data: leaderboard } = useSWR<TournamentLeaderboard | null>(
    API.tournaments.leaderboard(tournamentId, { limit: 3 }),
    fetcher,
    {
      fallbackData: initialTopTeams,
      refreshInterval: MINUTE,
    },
  );

  if (!leaderboard) return null;

  return (
    <>
      <Section title="Tournament Top Teams">
        <div className="grid lg:grid-cols-3 gap-6">
          {_.map(leaderboard.items, (team) => {
            const { id } = team;

            return (
              <Link key={id} href={routes.teams.details(id)}>
                <TeamCard team={team} />
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
};
