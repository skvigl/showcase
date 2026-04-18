import Image from "next/image";
import { notFound } from "next/navigation";

import { Section } from "@/shared/Section";
import { TeamPlayers } from "@/components/teams/TeamPlayers";
import { TeamLastResults } from "@/components/teams/TeamLastResults";
import { TeamFeaturedMatches } from "@/components/teams/TeamFeaturedMatches";
import { fetcherSSR } from "@/utils";
import { API } from "@/api";
import { TOURNAMENT_ID } from "@/constants";
import type { Match, Team, TeamLastResult } from "@/types";
import type { PageProps } from "@/app/types";
import type { PaginatedCollection, SimpleCollection } from "@/types/collection";

export const revalidate = 60;
export async function generateStaticParams() {
  const result = await fetcherSSR<PaginatedCollection<Team>>(API.teams.many());

  if (!result.ok) return [];

  return result.data.items.map((team) => ({
    id: team.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const result = await fetcherSSR<Team>(API.teams.one(id));

  if (!result.ok) return null;

  const team = result.data;

  return {
    title: `${team.name}`,
    description: `Information about ${team.name}`,
  };
}

export default async function TeamDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const teamResult = await fetcherSSR<Team>(API.teams.one(id, { include: "players" }));
  const teamsResult = await fetcherSSR<PaginatedCollection<Team>>(API.teams.many());
  const lastResults = await fetcherSSR<SimpleCollection<TeamLastResult>>(
    API.teams.lastResults(id, { tournamentId: TOURNAMENT_ID, limit: 5 }),
  );
  const featuredMatches = await fetcherSSR<SimpleCollection<Match>>(
    API.teams.featuredMatches(id, { tournamentId: TOURNAMENT_ID, limit: 3 }),
  );

  if (!teamResult.ok || !teamsResult.ok) {
    return notFound();
  }

  const team = teamResult.data;
  const teamsMap = new Map(teamsResult.data.items.map((t) => [t.id, t]));

  return (
    <>
      <Section className="py-20 bg-cyan-800 text-white">
        <h1 className="flex items-center m-0 text-6xl">
          <div className="w-16 h-16 mr-8">
            <Image src={`/assets/teams/${team.id}.svg`} width={128} height={128} alt="" />
          </div>
          <div>{team.name}</div>
        </h1>
      </Section>
      {lastResults.ok && <TeamLastResults teamId={id} initialTeamResults={lastResults.data} teamsMap={teamsMap} />}
      {featuredMatches.ok && (
        <TeamFeaturedMatches teamId={id} initialTeamFeaturedMatches={featuredMatches.data} teamsMap={teamsMap} />
      )}
      <TeamPlayers players={team.players} />
    </>
  );
}
