import type { EventRow } from "./event.repository.js";
import type { Event } from "../../types/event.js";

export function mapRowToEvent(row: EventRow): Event {
  return {
    id: row.id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
  };
}

export function mapRowsToEvents(rows: EventRow[]): Event[] {
  return rows.map(mapRowToEvent);
}
