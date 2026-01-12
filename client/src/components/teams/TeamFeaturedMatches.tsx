"use client";

import Link from "next/link";
import useSWR from "swr";
import _ from "lodash";

import { Section } from "@/shared/Section";
import { MatchCard } from "@/components/matches/MatchCard";
import { fetcher } from "@/utils";
import { routes } from "@/routes";
import type { Match } from "@/types";
import { API } from "@/api";

interface TeamFeaturedMatchesProps {
  teamId: string;
  initialTeamFeaturedMatches: Match[];
}

export const TeamFeaturedMatches: React.FC<TeamFeaturedMatchesProps> = ({ teamId, initialTeamFeaturedMatches }) => {
  const { data: teamFeaturedMatches } = useSWR<Match[] | null>(
    API.teams.featuredMatches(teamId, { limit: 3 }),
    fetcher,
    {
      fallbackData: initialTeamFeaturedMatches,
      refreshInterval: 60000,
    }
  );

  return (
    <>
      <Section title="Featured Matches">
        <div className="grid lg:grid-cols-3 gap-4">
          {_.map(teamFeaturedMatches, (match) => (
            <Link key={match.id} href={routes.matches.details(match.id)}>
              <MatchCard match={match} />
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
};
