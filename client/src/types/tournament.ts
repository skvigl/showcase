import { SimpleCollection } from "./collection";
import { Team } from "./team";

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface TeamLeaderboard extends Team {
  id: string;
  points: number;
  goalsScored: number;
  goalsConceded: number;
}

export type TournamentLeaderboardCollection = SimpleCollection<TeamLeaderboard>;

export interface TournamentStanding {
  id: string;
  teamId: string;
  place: number;
}

export type TournamentStandingCollection = SimpleCollection<TournamentStanding>;
