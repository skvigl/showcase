"use client";

import Link from "next/link";
import _ from "lodash";
import useSWR from "swr";

import { Section } from "@/shared/Section";
import { routes } from "@/routes";
import { fetcher } from "@/utils";
import { MatchCard } from "./MatchCard";
import type { Match } from "@/types";

interface FeaturedMatchesProps {
  eventId: string;
  initialFeaturedMatches: Match[];
}

export const FeaturedMatches: React.FC<FeaturedMatchesProps> = ({ eventId, initialFeaturedMatches }) => {
  const { data: matches } = useSWR<Match[] | null>(`/api/v1/events/${eventId}/featured-matches?limit=6`, fetcher, {
    fallbackData: initialFeaturedMatches,
    refreshInterval: 60000,
  });

  return (
    <>
      <Section title="Featured Matches">
        <div className="grid grid-cols-3 gap-6">
          {_.map(matches, (match) => {
            return (
              <Link key={match.id} href={routes.matches.details(match.id)}>
                <MatchCard match={match} />
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
};
