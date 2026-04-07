import { fetcherSSR } from "@/utils";
import { API } from "@/api";
import type { Event, Match, Team } from "@/types";
import type { PaginatedCollection } from "@/types/collection";
import { EVENT_ID } from "@/constants";
import { Matches } from "@/components/matches/Matches";

export default async function MatchesPage() {
  const teamsResult = await fetcherSSR<PaginatedCollection<Team>>(API.teams.many());
  const eventsResult = await fetcherSSR<PaginatedCollection<Event>>(API.events.many());
  const matchesResult = await fetcherSSR<PaginatedCollection<Match>>(
    API.matches.many({ eventId: EVENT_ID, pageSize: 90 }),
  );

  if (!teamsResult.ok || !eventsResult.ok || !matchesResult.ok) {
    return "Matches not found";
  }

  const teamsMap = new Map(teamsResult.data.items.map((t) => [t.id, t]));

  return <Matches teamsMap={teamsMap} events={eventsResult.data.items} initialMatchesResult={matchesResult.data} />;
}
