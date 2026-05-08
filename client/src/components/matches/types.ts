import { MatchAction } from "@/types";

export interface GroupedMatchAction extends MatchAction {
  fromPos: number;
  toPos: number;
  lastTick: number;
}
