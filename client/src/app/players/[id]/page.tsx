import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { fetcher } from "@/utils";
import { routes } from "@/routes";
import { API } from "@/api";
import { Section } from "@/shared/Section";
import { TeamCard } from "@/components/teams/TeamCard";
import type { Player, Team } from "@/types";
import type { PageProps } from "@/app/types";

export const revalidate = 60;
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const player = await fetcher<Player>(API.players.one(id));

  if (!player) return null;

  return {
    title: `${player.firstName} ${player.lastName}`,
    description: `Information about ${player.firstName} ${player.lastName}`,
  };
}

export default async function PlayerDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const player = await fetcher<Player>(API.players.one(id));

  if (!player) {
    return notFound();
  }

  let team = null;

  if (player.teamId) {
    team = await fetcher<Team>(API.teams.one(player.teamId.toString()));
  }

  return (
    <>
      <Section>
        <div className="grid grid-cols-[auto_1fr] gap-8 items-center">
          <div className="py-4">
            <Image src={`/avatars/${player.id}.svg`} width={200} height={200} priority alt="" />
          </div>
          <h1>
            <div className="text-6xl uppercase">{player.firstName}</div>
            <div className="text-6xl uppercase">{player.lastName}</div>
          </h1>
        </div>
      </Section>

      {team && (
        <Section title="Teams">
          <div className="grid grid-cols-3 gap-6">
            <Link href={routes.teams.details(team.id)}>
              <TeamCard team={team} />
            </Link>
          </div>
        </Section>
      )}

      <Section title="Key stats">
        <div>
          <div className="text-3xl font-bold">{player.power}</div>
          <div className="text-gray-500 font-medium">Power</div>
        </div>
      </Section>
    </>
  );
}
