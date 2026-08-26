import { Match } from "./match";
import { Player } from "./player";
import { Tournament } from "./tournament";

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updateAt: string;
  players?: Player[];
  standings?: TeamStanding[];
}

export interface TeamStanding {
  id: string;
  place: number;
  tournamentId: string;
  tournament: Tournament;
}

export interface TeamLeaderboard extends Team {
  id: string;
  points: number;
  goalsScored: number;
  goalsConceded: number;
}

export interface TeamLastResult extends Match {
  result: "W" | "D" | "L";
}
