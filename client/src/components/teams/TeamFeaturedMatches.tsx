"use client";

import useSWR from "swr";

import { fetcher } from "@/utils";
import { API } from "@/api";
import { EVENT_ID } from "@/constants";
import { MINUTE } from "@/app/config/intervals";
import { FeaturedMatches } from "../matches";
import type { SimpleCollection } from "@/types/collection";
import type { Match, Team } from "@/types";

interface TeamFeaturedMatchesProps {
  teamId: string;
  teamsMap: Map<Team["id"], Team>;
  initialTeamFeaturedMatches: SimpleCollection<Match>;
}

export const TeamFeaturedMatches: React.FC<TeamFeaturedMatchesProps> = ({
  teamId,
  teamsMap,
  initialTeamFeaturedMatches,
}) => {
  const { data: result } = useSWR<SimpleCollection<Match> | null>(
    API.teams.featuredMatches(teamId, { eventId: EVENT_ID, limit: 3 }),
    fetcher,
    {
      fallbackData: initialTeamFeaturedMatches,
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
