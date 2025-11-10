import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { pool } from "../../db/db.js";
import { EventCreateDto, EventParamsDto, EventUpdateDto } from "./event.schema.js";
import { mapRowsToEvents, mapRowToEvent } from "./event.mapper.js";
import type { Event } from "../../types/event.js";

const sql = String.raw;

export interface EventRow {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

class EventRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<Event[]> {
    try {
      const [rows] = await this.db.query<EventRow[] & RowDataPacket[]>(
        sql`
          SELECT id, name, start_date, end_date 
          FROM events
          WHERE deleted_at IS NULL
          ORDER BY start_date DESC;
        `,
        []
      );

      return mapRowsToEvents(rows);
    } catch (err) {
      console.log("EventRepository.findAll", err);
      throw err;
    }
  }

  async findById(id: EventParamsDto["id"]): Promise<Event | null> {
    try {
      const [rows] = await this.db.query<EventRow[] & RowDataPacket[]>(
        sql`
          SELECT id, name, start_date, end_date 
          FROM events 
          WHERE id = ? AND deleted_at IS NULL
        `,
        [id]
      );

      if (rows.length === 0) return null;

      return mapRowToEvent(rows[0]);
    } catch (err) {
      console.log("EventRepository.findById", err);
      throw err;
    }
  }

  async create(dto: EventCreateDto): Promise<Event | null> {
    try {
      const { name, startDate, endDate } = dto;
      const [result] = await this.db.query<EventRow & ResultSetHeader>(
        sql`
          INSERT INTO events (name, start_date, end_date)
          VALUES (?, ?, ?)
        `,
        [name, startDate, endDate]
      );

      return await this.findById(result.insertId);
    } catch (err) {
      console.log("EventRepository create", err);
      throw err;
    }
  }

  async update(id: EventParamsDto["id"], dto: EventUpdateDto): Promise<Event | null> {
    try {
      const { name, startDate, endDate } = dto;
      const [result] = await this.db.query<EventRow & ResultSetHeader>(
        sql`
          UPDATE events
          SET name = ?, start_date = ?, end_date = ?
          WHERE id = ? AND deleted_at IS NULL;
        `,
        [name, startDate, endDate, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return this.findById(id);
    } catch (err) {
      console.log("EventRepository update", err);
      throw err;
    }
  }

  async delete(id: EventParamsDto["id"]): Promise<EventParamsDto["id"] | null> {
    try {
      const [result] = await this.db.query<ResultSetHeader>(
        sql`
        UPDATE events
        SET deleted_at = NOW()
        WHERE id = ? AND deleted_at IS NULL;
      `,
        [id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return id;
    } catch (err) {
      console.log("EventRepository delete", err);
      throw err;
    }
  }
}

export const eventRepo = new EventRepository(pool);
