"use client";

import useSWR from "swr";

import { fetcher } from "@/utils";
import { API } from "@/api";
import { ONE_MINUTE } from "@/app/config/intervals";
import { FeaturedMatches } from "../matches";
import type { Match, Team } from "@/types";
import type { SimpleCollection } from "@/types/collection";

interface HomeFeaturedMatchesProps {
  eventId: string;
  teamsMap: Map<Team["id"], Team>;
  initialFeaturedMatches: SimpleCollection<Match>;
}

export const HomeFeaturedMatches: React.FC<HomeFeaturedMatchesProps> = ({
  eventId,
  teamsMap,
  initialFeaturedMatches,
}) => {
  const { data: result } = useSWR<SimpleCollection<Match> | null>(
    API.events.featuredMatches(eventId, { limit: 6 }),
    fetcher,
    {
      fallbackData: initialFeaturedMatches,
      refreshInterval: ONE_MINUTE,
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
