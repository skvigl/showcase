import { SmallCard } from "@/components/SmallCard";
import type { Player } from "@/types";

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const src = `/avatars/${player.id}.svg`;

  return <SmallCard src={src} title={`${player.firstName} ${player.lastName}`} subtitle="Player" />;
};
