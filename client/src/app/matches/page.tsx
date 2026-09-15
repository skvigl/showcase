import { fetcherSSR } from "@/utils";
import { API } from "@/api";
import type { Tournament, Match, Team } from "@/types";
import type { PaginatedCollection } from "@/types/collection";
import { TOURNAMENT_ID } from "@/constants";
import { Matches } from "@/components/matches/Matches";
import { Section } from "@/shared/Section";
import { PageHeading } from "@/shared/PageHeading";

export default async function MatchesPage() {
  const teamsResult = await fetcherSSR<PaginatedCollection<Team>>(API.teams.many());
  const tournamentsResult = await fetcherSSR<PaginatedCollection<Tournament>>(API.tournaments.many());
  const matchesResult = await fetcherSSR<PaginatedCollection<Match>>(
    API.matches.many({ tournamentId: TOURNAMENT_ID, pageSize: 90 }),
  );

  if (!teamsResult.ok || !tournamentsResult.ok || !matchesResult.ok) {
    return (
      <Section>
        <PageHeading title="Matches" />
        <div>Matches not found</div>
      </Section>
    );
  }

  const teamsMap = new Map(teamsResult.data.items.map((t) => [t.id, t]));

  return (
    <Matches teamsMap={teamsMap} tournaments={tournamentsResult.data.items} initialMatchesResult={matchesResult.data} />
  );
}
