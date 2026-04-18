"use client";

import useSWR from "swr";

import { fetcher } from "@/utils";
import { API } from "@/api";
import { MINUTE } from "@/app/config/intervals";
import { FeaturedMatches } from "../matches";
import type { Match, Team } from "@/types";
import type { SimpleCollection } from "@/types/collection";

interface HomeFeaturedMatchesProps {
  tournamentId: string;
  teamsMap: Map<Team["id"], Team>;
  initialFeaturedMatches: SimpleCollection<Match>;
}

export const HomeFeaturedMatches: React.FC<HomeFeaturedMatchesProps> = ({
  tournamentId,
  teamsMap,
  initialFeaturedMatches,
}) => {
  const { data: result } = useSWR<SimpleCollection<Match> | null>(
    API.tournaments.featuredMatches(tournamentId, { limit: 6 }),
    fetcher,
    {
      fallbackData: initialFeaturedMatches,
      refreshInterval: MINUTE,
    },
  );

  if (!result) {
    return null;
  }

  return (
    <>
      <FeaturedMatches teamsMap={teamsMap} matches={result.items} />
    </>
  );
};
