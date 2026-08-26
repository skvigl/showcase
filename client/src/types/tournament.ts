import { SimpleCollection } from "./collection";
import { TeamLeaderboard } from "./team";

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export type TournamentLeaderboard = SimpleCollection<TeamLeaderboard>;
