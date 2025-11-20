"use client";

import Link from "next/link";
import useSWR from "swr";
import _ from "lodash";

import { fetcher } from "@/utils";
import { routes } from "@/routes";
import { PlayerCard } from "@/components/players/PlayerCard";
import { PlayersSkeleton } from "./PlayersSkeleton";
import type { Player } from "@/types";
import { API } from "@/api";

export const Players = ({ page }: { page: number }) => {
  const { data: players, isLoading } = useSWR<Player[] | null>(API.players.many({ page, limit: 20 }), fetcher);

  if (isLoading) {
    return <PlayersSkeleton />;
  }

  if (!players) {
    return <div>No players found</div>;
  }

  return (
    <div className="grid grid-cols-5 gap-6">
      {_.map(players, (player) => (
        <Link key={player.id} href={routes.players.details(player.id)}>
          <PlayerCard player={player} />
        </Link>
      ))}
    </div>
  );
};
