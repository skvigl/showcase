import _ from "lodash";
import Link from "next/link";

import { Section } from "@/shared/Section";
import { PlayerCard } from "@/components/players";
import { routes } from "@/routes";
import type { Player } from "@/types";

interface TeamPlayersProps {
  players: Player[] | undefined;
}

export const TeamPlayers: React.FC<TeamPlayersProps> = async ({ players }) => {
  return (
    <>
      <Section title="Players">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {_.map(players, (player) => (
            <Link key={player.id} href={routes.players.details(player.id)}>
              <PlayerCard player={player} />
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
};
