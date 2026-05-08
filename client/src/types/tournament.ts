import { SimpleCollection } from "./collection";
import { TeamWithPoints } from "./team";

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export type TournamentLeaderboard = SimpleCollection<TeamWithPoints>;
