import { SmallCard } from "@/components/SmallCard";
import type { Team } from "@/types";

interface TeamCardProps {
  team: Team;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const src = `/teams/${team.id}.svg`;

  return <SmallCard src={src} title={team.name} subtitle="Team" />;
};
