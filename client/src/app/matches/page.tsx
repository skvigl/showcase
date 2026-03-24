import { fetcher } from "@/utils";
import { API } from "@/api";
import type { Event, Match, Team } from "@/types";
import type { PaginatedCollection } from "@/types/collection";
import { EVENT_ID } from "@/constants";
import { Matches } from "@/components/matches/Matches";

export default async function MatchesPage() {
  const teamsResult = await fetcher<PaginatedCollection<Team>>(API.teams.many());
  const eventsResult = await fetcher<PaginatedCollection<Event> | null>(API.events.many());
  const matchesResult = await fetcher<PaginatedCollection<Match> | null>(
    API.matches.many({ eventId: EVENT_ID, pageSize: 90 }),
  );

  if (!teamsResult || !eventsResult || !matchesResult) {
    return "Matches not found";
  }

  const teamsMap = new Map(teamsResult.items.map((t) => [t.id, t]));

  return <Matches teamsMap={teamsMap} events={eventsResult.items} initialMatchesResult={matchesResult} />;
}
