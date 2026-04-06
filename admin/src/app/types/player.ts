import { Team } from './team';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  power: number;
  teamId: string | null;
  createdAt: string;
  updatedAt: string;
  team?: Team;
}
