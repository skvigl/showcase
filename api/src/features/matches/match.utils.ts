import { BaseMatch } from "./match.mapper.js";
import type { Match } from "../../types/match.js";
import type { Team } from "../../types/team.js";

export function collectTeamIds(matches: BaseMatch[]): number[] {
  const ids = new Set<number>();

  for (const m of matches) {
    ids.add(m.home.id);
    ids.add(m.away.id);
  }

  return Array.from(ids);
}

export function attachTeamNames(matches: BaseMatch[], teamMap: Map<number, Team>): Match[] {
  return matches.map((m) => ({
    ...m,
    home: {
      ...m.home,
      name: teamMap.get(m.home.id)?.name ?? "Unknown",
    },
    away: {
      ...m.away,
      name: teamMap.get(m.away.id)?.name ?? "Unknown",
    },
  }));
}
