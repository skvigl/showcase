"use client";

import Link from "next/link";
import _ from "lodash";
import useSWR from "swr";

import { Section } from "@/shared/Section";
import { routes } from "@/routes";
import { fetcher } from "@/utils";
import { API } from "@/api";
import { TeamCard } from "@/components/teams/TeamCard";
import type { TeamWithPoints } from "@/types";

interface EventTopTeamsProps {
  eventId: string;
  initialTopTeams: TeamWithPoints[];
}

export const EventTopTeams: React.FC<EventTopTeamsProps> = ({ eventId, initialTopTeams }) => {
  const { data: teams } = useSWR<TeamWithPoints[] | null>(API.events.leaderboard(eventId, { limit: 3 }), fetcher, {
    fallbackData: initialTopTeams,
    refreshInterval: 60000,
  });

  return (
    <>
      <Section title="Event Top Teams">
        <div className="grid grid-cols-3 gap-4">
          {_.map(teams, (team) => {
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
