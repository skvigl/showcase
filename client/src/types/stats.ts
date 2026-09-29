import { SimpleCollection } from "./collection";
import { MatchActionType } from "./match";

export interface PlayerStatsOverview {
  player: Record<MatchActionType, number>;
  max: Record<MatchActionType, number>;
}

export type PlayerMatchStats = SimpleCollection<{
  matchId: string;
  date: string;
  actions: Record<MatchActionType, number>;
}>;
