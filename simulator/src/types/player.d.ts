import { Team } from "./team.ts";

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  attack: number;
  defence: number;
  teamId: number | null;
  createdAt: string;
  updatedAt: string;
  team?: Team;
}
