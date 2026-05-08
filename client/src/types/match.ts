import { Team } from "./team";

export const MatchStatus = {
  scheduled: "scheduled",
  live: "live",
  finished: "finished",
} as const;

export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus];

export interface Match {
  id: string;
  tournamentId: string;
  date: string;
  status: MatchStatus;
  duration: number;
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeTeamScore: number;
  awayTeamScore: number;
  createdAt: string;
  updatedAt: string;
  homeTeam?: Team;
  awayTeam?: Team;
}

export const MatchActionType = {
  grab: "grab",
  move: "move",
  steal: "steal",
  knockout: "knockout",
  score: "score",
} as const;

export type MatchActionType = (typeof MatchActionType)[keyof typeof MatchActionType];

export interface MatchAction {
  id?: string;
  matchId: string;
  tick: number;
  type: MatchActionType;
  actorId: string;
  targetId: string | null;
  position: number;
}
