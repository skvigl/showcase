import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetcherSSR } from "@/utils";
import { routes } from "@/routes";
import { API } from "@/api";
import { Section } from "@/shared/Section";
import { TeamCard } from "@/components/teams/TeamCard";
import type { Player } from "@/types";
import type { PageProps } from "@/app/types";
import { PlayerRadar } from "@/components/players/PlayerRadar";
import { PlayerPerformance } from "@/components/players/PlayerPerformance";

export const revalidate = 60;
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const result = await fetcherSSR<Player>(API.players.one(id));

  if (!result.ok) return null;

  const player = result.data;

  return {
    title: `${player.firstName} ${player.lastName}`,
    description: `Information about ${player.firstName} ${player.lastName}`,
  };
}

export default async function PlayerDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const result = await fetcherSSR<Player>(API.players.one(id, { include: "team" }));

  if (!result.ok) {
    return notFound();
  }

  const player = result.data;
  const team = player.team ?? null;

  return (
    <>
      <Section>
        <div className="lg:grid grid-cols-2 gap-2 lg:gap-4">
          <div className="grid grid-cols-[auto_1fr] gap-4 lg:gap-8 items-center">
            <div className="max-w-36 lg:max-w-48 py-4">
              <Image src={`/assets/avatars/${player.id}.svg`} width={200} height={200} priority alt="" />
            </div>
            <h1 className="font-medium">
              <div className="text-3xl lg:text-6xl">{player.firstName}</div>
              <div className="text-3xl lg:text-6xl">{player.lastName}</div>
            </h1>
          </div>
          <div>
            <h2 className="my-8 text-3xl font-medium lg:hidden">Skill Radar</h2>
            <div className="relative w-full h-60 min-w-0">
              <div className="absolute inset-0">
                <PlayerRadar id={id} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {team && (
        <Section title="Team">
          <div className="grid lg:grid-cols-3 gap-6">
            <Link href={routes.teams.details(team.id)}>
              <TeamCard team={team} />
            </Link>
          </div>
        </Section>
      )}

      <Section title="Key stats">
        <div className="grid lg:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold">{player.attack}</div>
            <div className="text-gray-500 font-medium">Attack</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{player.defence}</div>
            <div className="text-gray-500 font-medium">Defence</div>
          </div>
        </div>
      </Section>

      <Section title="Performance">
        <div className="relative w-full h-80 min-w-0">
          <div className="absolute inset-0">
            <PlayerPerformance id={id} />
          </div>
        </div>
      </Section>
    </>
  );
}
