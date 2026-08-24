import { Match } from "./match";
import { Player } from "./player";

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updateAt: string;
  players?: Player[];
}

export interface TeamStanding extends Team {
  points: number;
  goalsScored: number;
  goalsConceded: number;
}

export interface TeamLastResult extends Match {
  result: "W" | "D" | "L";
}
