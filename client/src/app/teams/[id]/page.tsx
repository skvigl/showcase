import Image from "next/image";
import { notFound } from "next/navigation";

import { Section } from "@/shared/Section";
import { TeamPlayers } from "@/components/teams/TeamPlayers";
import { TeamLastResults } from "@/components/teams/TeamLastResults";
import { TeamFeaturedMatches } from "@/components/teams/TeamFeaturedMatches";
import { fetcher } from "@/utils";
import { API } from "@/api";
import { EVENT_ID } from "@/constants";
import type { Match, Team, TeamLastResult } from "@/types";
import type { PageProps } from "@/app/types";
import type { PaginatedCollection, SimpleCollection } from "@/types/collection";

export const revalidate = 60;
export async function generateStaticParams() {
  const result = await fetcher<PaginatedCollection<Team>>(API.teams.many());

  if (!result) return [];

  return result.items.map((team) => ({
    id: team.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const team = await fetcher<Team>(API.teams.one(id));

  if (!team) return null;

  return {
    title: `${team.name}`,
    description: `Information about ${team.name}`,
  };
}

export default async function TeamDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const team = await fetcher<Team>(API.teams.one(id, { include: "players" }));
  const teamsResult = await fetcher<PaginatedCollection<Team>>(API.teams.many());
  const lastResults = await fetcher<SimpleCollection<TeamLastResult>>(
    API.teams.lastResults(id, { eventId: EVENT_ID, limit: 5 }),
  );
  const featuredMatches = await fetcher<SimpleCollection<Match>>(
    API.teams.featuredMatches(id, { eventId: EVENT_ID, limit: 3 }),
  );

  if (!team || !teamsResult) {
    return notFound();
  }

  const teamsMap = new Map(teamsResult.items.map((t) => [t.id, t]));

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
      {lastResults && <TeamLastResults teamId={id} initialTeamResults={lastResults} teamsMap={teamsMap} />}
      {featuredMatches && (
        <TeamFeaturedMatches teamId={id} initialTeamFeaturedMatches={featuredMatches} teamsMap={teamsMap} />
      )}
      <TeamPlayers players={team.players} />
    </>
  );
}
