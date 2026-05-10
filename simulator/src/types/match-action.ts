export type MatchActionType = "grab" | "move" | "steal" | "knockout" | "score";

export interface MatchAction {
  matchId: string;
  tick: number;
  type: MatchActionType;
  actorId: string;
  targetId: string | null;
  position: number;
}
