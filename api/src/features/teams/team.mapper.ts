import { TeamRow } from "./team.repository.js";
import type { Team } from "../../types/team.js";

export function mapRowToTeam(row: TeamRow): Team {
  return {
    id: row.id,
    name: row.name,
  };
}

export function mapRowsToTeams(rows: TeamRow[]): Team[] {
  return rows.map(mapRowToTeam);
}
