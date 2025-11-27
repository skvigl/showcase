import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { pool } from "../../db/db.js";
import { mapRowsToMatches, mapRowToMatch, BaseMatch } from "./match.mapper.js";
import { MatchCreateDto, MatchUpdateDto } from "./match.schema.js";

const sql = String.raw;

function toMySQLDate(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export interface MatchRow {
  id: number;
  date: string;
  status: "scheduled" | "live" | "finished";
  event_id: number;
  home_team_id: number;
  home_team_score: number;
  away_team_id: number;
  away_team_score: number;
}

export class MatchRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<BaseMatch[]> {
    try {
      const [rows] = await this.db.query<(MatchRow & RowDataPacket)[]>(
        sql`
          SELECT 
            id, date, status, event_id, home_team_id, away_team_id,
            home_team_score, away_team_score
          FROM matches
          ORDER BY date ASC
        `,
        []
      );

      return mapRowsToMatches(rows);
    } catch (err) {
      console.log("MatchRepository.findAll", err);
      throw err;
    }
  }

  async findById(id: number): Promise<BaseMatch | null> {
    try {
      const [rows] = await this.db.query<(MatchRow & RowDataPacket)[]>(
        sql`
          SELECT
            id, date, status, event_id, home_team_id, away_team_id,
            home_team_score, away_team_score
          FROM matches m
          WHERE id = ?
        `,
        [id]
      );

      if (rows.length === 0) return null;

      return mapRowToMatch(rows[0]);
    } catch (err) {
      console.log("MatchRepository.findById", err);
      throw err;
    }
  }

  async findByTeamId(teamId: number): Promise<BaseMatch[]> {
    try {
      const [rows] = await this.db.query<(MatchRow & RowDataPacket)[]>(
        sql`
           SELECT 
            id, date, status, event_id, home_team_id, away_team_id,
            home_team_score, away_team_score 
          FROM matches
          WHERE home_team_id = ? OR away_team_id = ?
          ORDER BY date ASC
        `,
        [teamId, teamId]
      );

      return mapRowsToMatches(rows);
    } catch (err) {
      console.log("MatchRepository.findByTeamId", err);
      throw err;
    }
  }

  async findByEventId(eventId: number): Promise<BaseMatch[]> {
    try {
      const [rows] = await this.db.query<(MatchRow & RowDataPacket)[]>(
        sql`
          SELECT 
            id, date, status, event_id, home_team_id, away_team_id,
            home_team_score, away_team_score
          FROM matches
          WHERE event_id = ? 
          ORDER BY date ASC
        `,
        [eventId]
      );

      return mapRowsToMatches(rows);
    } catch (err) {
      console.log("MatchRepository.findByEventId", err);
      throw err;
    }
  }

  async create(dto: MatchCreateDto): Promise<BaseMatch | null> {
    try {
      const { eventId, homeTeamId, awayTeamId, date } = dto;
      const [result] = await this.db.query<ResultSetHeader>(
        sql`
          INSERT INTO matches (event_id, home_team_id, away_team_id, date)
          VALUES (?, ?, ?, ?)
        `,
        [eventId, homeTeamId, awayTeamId, toMySQLDate(new Date(date))]
      );

      return await this.findById(result.insertId);
    } catch (err) {
      console.log("MatchRepository.create", err);
      throw err;
    }
  }

  async update(id: number, dto: MatchUpdateDto): Promise<BaseMatch | null> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (dto.eventId !== undefined) {
        updates.push("event_id = ?");
        values.push(dto.eventId);
      }

      if (dto.homeTeamId !== undefined) {
        updates.push("home_team_id = ?");
        values.push(dto.homeTeamId);
      }

      if (dto.awayTeamId !== undefined) {
        updates.push("away_team_id = ?");
        values.push(dto.awayTeamId);
      }

      if (dto.date !== undefined) {
        updates.push("date = ?");
        values.push(toMySQLDate(new Date(dto.date)));
      }

      if (dto.status !== undefined) {
        updates.push("status = ?");
        values.push(dto.status);
      }

      if (dto.homeTeamScore !== undefined) {
        updates.push("home_team_score = ?");
        values.push(dto.homeTeamScore);
      }

      if (dto.awayTeamScore !== undefined) {
        updates.push("away_team_score = ?");
        values.push(dto.awayTeamScore);
      }

      if (updates.length === 0) {
        return this.findById(id);
      }

      const [result] = await pool.execute<ResultSetHeader>(
        sql`
          UPDATE matches
          SET ${updates.join(", ")}
          WHERE id = ?;
        `,
        [...values, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return this.findById(id);
    } catch (err) {
      console.log("MatchRepository.update", err);
      throw err;
    }
  }

  async delete(id: number): Promise<number | null> {
    try {
      const [result] = await this.db.query<ResultSetHeader>(
        sql`
            UPDATE matches
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
      console.log("MatchRepository.delete", err);
      throw err;
    }
  }
}

export const matchRepo = new MatchRepository(pool);
