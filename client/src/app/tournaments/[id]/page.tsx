import { notFound } from "next/navigation";

import { Container } from "@/shared/Container";
import { Section } from "@/shared/Section";
import { TournamentLeaderboard } from "@/components/tournaments/TournamentLeaderboard";
import { fetcherSSR } from "@/utils";
import { API } from "@/api";
import type { Tournament, TournamentLeaderboard as TTournamentLeaderboard } from "@/types";
import type { PageProps } from "@/app/types";
import type { PaginatedCollection } from "@/types/collection";

export const revalidate = 60;
export async function generateStaticParams() {
  const result = await fetcherSSR<PaginatedCollection<Tournament>>(API.tournaments.many());

  if (!result.ok) return [];

  return result.data.items.map((tr) => ({
    id: tr.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const result = await fetcherSSR<Tournament>(API.tournaments.one(id));

  if (!result.ok) return null;

  const tournament = result.data;

  return {
    title: `${tournament.name}`,
    description: `Information about ${tournament.name}`,
  };
}

export default async function TournamentDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const tournamentResult = await fetcherSSR<Tournament>(API.tournaments.one(id));
  const leaderboardResult = await fetcherSSR<TTournamentLeaderboard>(API.tournaments.leaderboard(id));

  if (!tournamentResult.ok) {
    notFound();
  }

  const tournament = tournamentResult.data;

  return (
    <>
      <section className="p-8 py-20 bg-cyan-800 text-6xl text-white text-center">
        <Container>
          <h1 className="text-5xl">{tournament.name}</h1>
        </Container>
      </section>

      {leaderboardResult.ok && (
        <Section className="max-w-[800px] mx-auto">
          <TournamentLeaderboard tournamentId={id} initialLeaderboard={leaderboardResult.data} />
        </Section>
      )}
    </>
  );
}
