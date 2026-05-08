import { eachWeekOfInterval, endOfWeek, isWithinInterval } from "date-fns";

import { Match, MatchAction, MatchActionType, Team } from "@/types";
import { GroupedMatchAction } from "./types";

export function buildWeeks(tournamentStart: Date, tournamentEnd: Date, matches: Match[]) {
  const weekStarts = eachWeekOfInterval({ start: tournamentStart, end: tournamentEnd }, { weekStartsOn: 1 });
  const weeks = weekStarts.map((weekStart) => ({
    weekStart,
    weekEnd: endOfWeek(weekStart, { weekStartsOn: 1 }),
    matches: [] as Match[],
  }));

  for (const match of matches) {
    const date = new Date(match.date);

    const index = weekStarts.findIndex((weekStart) =>
      isWithinInterval(date, {
        start: weekStart,
        end: endOfWeek(weekStart, { weekStartsOn: 1 }),
      }),
    );

    if (index !== -1) {
      weeks[index].matches.push(match);
    }
  }

  return weeks.filter((week) => week.matches.length > 0);
}

export const groupActions = (actions: MatchAction[]): GroupedMatchAction[] => {
  const grouped: GroupedMatchAction[] = [];
  const playerPositions: Record<string, number> = {};

  actions.forEach((action) => {
    const last = grouped[grouped.length - 1];
    const prevPos = playerPositions[action.actorId];

    if (
      action.type === MatchActionType.move &&
      last &&
      last.type === MatchActionType.move &&
      last.actorId === action.actorId
    ) {
      last.toPos = action.position;
      last.lastTick = action.tick;
    } else if (action.type === MatchActionType.move && prevPos === action.position) {
      return;
    } else {
      grouped.push({
        ...action,
        fromPos: prevPos ?? action.position,
        toPos: action.position,
        lastTick: action.tick,
      });
    }

    playerPositions[action.actorId] = action.position;
  });

  return grouped;
};

export const getHomePlayerIds = (team: Team): Set<string> => new Set(team.players?.map((p) => p.id) ?? []);
