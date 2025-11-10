import { Match } from "./match.js";

export interface Team {
  id: number;
  name: string;
}

export interface TeamWithPoints extends Team {
  points: number;
}

export interface TeamLastResult extends Match {
  result: "W" | "D" | "L";
}
