import { Match } from "./match";
import { Player } from "./player";

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updateAt: string;
  players?: Player[];
}

export interface TeamWithPoints extends Team {
  points: number;
}

export interface TeamLastResult extends Match {
  result: "W" | "D" | "L";
}
