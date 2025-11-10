import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { pool } from "../../db/db.js";
import { mapRowsToPlayers, mapRowToPlayer } from "./player.mapper.js";
import { PlayerCreateDto, PlayerParamsDto, PlayerQueryDto, PlayerUpdateDto } from "./player.schema.js";
import type { Player } from "../../types/player.js";

const sql = String.raw;

export interface PlayerRow {
  id: number;
  first_name: string;
  last_name: string;
  power: number;
  team_id: number;
}

export class PlayerRepository {
  constructor(private db: Pool) {}

  async findAll(dto: PlayerQueryDto): Promise<Player[]> {
    try {
      const { page = 1, limit = 20 } = dto;
      const [rows] = await this.db.query<(PlayerRow & RowDataPacket)[]>(
        sql`
          SELECT id, first_name, last_name, power, team_id 
          FROM players 
          WHERE deleted_at IS NULL
          ORDER BY first_name ASC
          LIMIT ? OFFSET ?;
        `,
        [limit, (page - 1) * limit]
      );

      return mapRowsToPlayers(rows);
    } catch (err) {
      console.log("PlayerRepository.findAll", err);
      throw err;
    }
  }

  async findById(id: PlayerParamsDto["id"]): Promise<Player | null> {
    try {
      const [rows] = await this.db.query<PlayerRow[] & RowDataPacket[]>(
        sql`
          SELECT id, first_name, last_name, power, team_id 
          FROM players 
          WHERE id = ? AND deleted_at IS NULL;
        `,
        [id]
      );

      if (rows.length === 0) return null;

      return mapRowToPlayer(rows[0]);
    } catch (err) {
      console.log("PlayerRepository.findById", err);
      throw err;
    }
  }

  async findByTeamId(id: number): Promise<Player[]> {
    try {
      const [rows] = await this.db.query<(PlayerRow & RowDataPacket)[]>(
        sql`
          SELECT id, first_name, last_name, power, team_id
          FROM players
          WHERE team_id = ? AND deleted_at IS NULL;
        `,
        [id]
      );

      return mapRowsToPlayers(rows);
    } catch (err) {
      console.log("TeamRepository.findByTeamId", err);
      throw err;
    }
  }

  async create(dto: PlayerCreateDto): Promise<Player | null> {
    try {
      const { firstName, lastName, power, teamId } = dto;
      const [result] = await this.db.query<PlayerRow & ResultSetHeader>(
        sql`
          INSERT INTO players (first_name, last_name, power, team_id)
          VALUES (?, ?, ?, ?)
        `,
        [firstName, lastName, power, teamId]
      );

      return await this.findById(result.insertId);
    } catch (err) {
      console.log("PlayerRepository.create", err);
      throw err;
    }
  }

  async update(id: PlayerParamsDto["id"], dto: PlayerUpdateDto): Promise<Player | null> {
    try {
      const { firstName, lastName, power, teamId } = dto;
      const [result] = await this.db.query<PlayerRow & ResultSetHeader>(
        sql`
          UPDATE players
          SET first_name = ?, last_name = ?, power = ?, team_id = ?
          WHERE id = ? AND deleted_at IS NULL;
        `,
        [firstName, lastName, power, teamId, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return this.findById(id);
    } catch (err) {
      console.log("PlayerRepository update", err);
      throw err;
    }
  }

  async delete(id: PlayerParamsDto["id"]): Promise<PlayerParamsDto["id"] | null> {
    try {
      const [result] = await this.db.query<ResultSetHeader>(
        sql`
          UPDATE players
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
      console.log("PlayerRepository delete", err);
      throw err;
    }
  }
}

export const playerRepo = new PlayerRepository(pool);
