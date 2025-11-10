import { MatchRow } from "./match.repository.js";

export type BaseMatch = {
  id: number;
  eventId: number;
  date: string;
  status: "scheduled" | "live" | "finished";
  home: {
    id: number;
    score: number;
  };
  away: {
    id: number;
    score: number;
  };
};

export function mapRowToMatch(row: MatchRow): BaseMatch {
  return {
    id: row.id,
    eventId: row.event_id,
    date: row.date,
    status: row.status,
    home: {
      id: row.home_team_id,
      score: row.home_team_score,
    },
    away: {
      id: row.away_team_id,
      score: row.away_team_score,
    },
  };
}

export function mapRowsToMatches(rows: MatchRow[]): BaseMatch[] {
  return rows.map(mapRowToMatch);
}
