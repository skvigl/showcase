"use client";

import Link from "next/link";
import _ from "lodash";
import useSWR from "swr";

import { Section } from "@/shared/Section";
import { routes } from "@/routes";
import { fetcher } from "@/utils";
import { API } from "@/api";
import { TeamCard } from "@/components/teams/TeamCard";
import { ONE_MINUTE } from "@/app/config/intervals";
import type { EventLeaderboard } from "@/types";

interface EventTopTeamsProps {
  eventId: string;
  initialTopTeams: EventLeaderboard;
}

export const EventTopTeams: React.FC<EventTopTeamsProps> = ({ eventId, initialTopTeams }) => {
  const { data: leaderboard } = useSWR<EventLeaderboard | null>(
    API.events.leaderboard(eventId, { limit: 3 }),
    fetcher,
    {
      fallbackData: initialTopTeams,
      refreshInterval: ONE_MINUTE,
    },
  );

  if (!leaderboard) return null;

  return (
    <>
      <Section title="Event Top Teams">
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
