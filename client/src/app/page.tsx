import type { Metadata } from "next";

import { TournamentTopTeams } from "@/components/tournaments";
import { Container } from "@/shared/Container";
import { fetcherSSR } from "@/utils";
import { API } from "@/api";
import { TOURNAMENT_ID } from "@/constants";
import type { TournamentLeaderboard, Match, Team } from "@/types";
import type { PaginatedCollection, SimpleCollection } from "@/types/collection";
import { HomeFeaturedMatches } from "@/components/home/HomeFeaturedMatches";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Showcase - Fantasy soccer",
  description: "Showcase website by Maksim Kadomtsev",
};

export default async function HomePage() {
  const teamsResult = await fetcherSSR<PaginatedCollection<Team>>(API.teams.many());
  const featuredMatches = await fetcherSSR<SimpleCollection<Match>>(
    API.tournaments.featuredMatches(TOURNAMENT_ID, { limit: 6 }),
  );
  const tournamentResult = await fetcherSSR<TournamentLeaderboard>(
    API.tournaments.leaderboard(TOURNAMENT_ID, { limit: 3 }),
  );

  if (!teamsResult.ok) {
    return null;
  }

  const teamsMap = new Map(teamsResult.data.items.map((t) => [t.id, t]));

  return (
    <>
      <div className="px-8 py-16 bg-cyan-800 text-gray-50">
        <Container>
          <h1 className="text-4xl lg:text-9xl font-medium text-center uppercase">Showcase</h1>
        </Container>
      </div>

      {featuredMatches.ok && (
        <HomeFeaturedMatches
          tournamentId={TOURNAMENT_ID}
          initialFeaturedMatches={featuredMatches.data}
          teamsMap={teamsMap}
        />
      )}
      {tournamentResult.ok && (
        <TournamentTopTeams tournamentId={TOURNAMENT_ID} initialTopTeams={tournamentResult.data} />
      )}
    </>
  );
}
