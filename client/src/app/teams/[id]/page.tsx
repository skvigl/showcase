import Image from "next/image";
import { notFound } from "next/navigation";

import { Section } from "@/shared/Section";
import { TeamPlayers } from "@/components/teams/TeamPlayers";
import { TeamLastResults } from "@/components/teams/TeamLastResults";
import { TeamFeaturedMatches } from "@/components/teams/TeamFeaturedMatches";
import { fetcher } from "@/utils";
import type { Match, Team, TeamLastResult } from "@/types";
import type { PageProps } from "@/app/types";

export const revalidate = 60;
export async function generateStaticParams() {
  const teams = await fetcher<Team[]>("/api/v1/teams");

  if (!teams) return [];

  return teams.map((team) => ({
    id: team.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const team = await fetcher<Team>(`/api/v1/teams/${id}`);

  if (!team) return null;

  return {
    title: `${team.name}`,
    description: `Information about ${team.name}`,
  };
}

export default async function TeamDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const team = await fetcher<Team>(`/api/v1/teams/${id}`);
  const lastResults = await fetcher<TeamLastResult[]>(`/api/v1/teams/${id}/last-results`);
  const featuredMatches = await fetcher<Match[]>(`/api/v1/teams/${id}/featured-matches?limit=3`);

  if (!team) {
    return notFound();
  }

  return (
    <>
      <Section className="py-20 bg-cyan-800 text-white">
        <h1 className="flex items-center m-0 text-6xl">
          <div className="w-16 h-16 mr-8">
            <Image src={`/teams/${team.id}.svg`} width={128} height={128} alt="" />
          </div>
          <div>{team.name}</div>
        </h1>
      </Section>
      {lastResults && <TeamLastResults teamId={id} initialTeamResults={lastResults} />}
      {featuredMatches && <TeamFeaturedMatches teamId={id} initialTeamFeaturedMatches={featuredMatches} />}
      <TeamPlayers teamId={id} />
    </>
  );
}
