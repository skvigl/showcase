import { Team } from './team';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  attack: number;
  defence: number;
  teamId: string | null;
  createdAt: string;
  updatedAt: string;
  team?: Team;
}
