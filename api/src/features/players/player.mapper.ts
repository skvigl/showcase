import { PlayerRow } from "./player.repository.js";
import { Player } from "../../types/player.js";

export function mapRowToPlayer(row: PlayerRow): Player {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    power: row.power,
    teamId: row.team_id,
  };
}

export function mapRowsToPlayers(rows: PlayerRow[]): Player[] {
  return rows.map(mapRowToPlayer);
}
