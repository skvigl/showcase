import Link from "next/link";
import _ from "lodash";

import { routes } from "@/routes";
import { PlayerCard } from "@/components/players/PlayerCard";
import type { Player } from "@/types";

type PlayersProps = {
  page: number;
  players: Player[];
};

export const Players = ({ players }: PlayersProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
      {_.map(players, (player) => (
        <Link key={player.id} href={routes.players.details(player.id)}>
          <PlayerCard player={player} />
        </Link>
      ))}
    </div>
  );
};
