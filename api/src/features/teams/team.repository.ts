import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { pool } from "../../db/db.js";
import { mapRowsToTeams, mapRowToTeam } from "./team.mapper.js";
import type { TeamCreateDto, TeamParamsDto, TeamUpdateDto } from "./team.schema.js";
import type { Team } from "../../types/team.js";

const sql = String.raw;

export interface TeamRow {
  id: number;
  name: string;
}

class TeamRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<Team[]> {
    try {
      const [rows] = await this.db.query<(TeamRow & RowDataPacket)[]>(
        sql`
          SELECT id, name
          FROM teams
          WHERE deleted_at IS NULL                                                                                                                                                                                                                                                                                                                                     
          ORDER BY name ASC
        `,
        []
      );

      return mapRowsToTeams(rows);
    } catch (err) {
      console.log("TeamRepository.findAll", err);
      throw err;
    }
  }

  async findById(id: TeamParamsDto["id"]): Promise<Team | null> {
    try {
      const [rows] = await this.db.query<(TeamRow & RowDataPacket)[]>(
        sql`
          SELECT id, name
          FROM teams 
          WHERE id = ? AND deleted_at IS NULL
        `,
        [id]
      );

      if (rows.length === 0) return null;

      return mapRowToTeam(rows[0]);
    } catch (err) {
      console.log("TeamRepository.findById", err);
      throw err;
    }
  }

  async findByIds(ids: number[]): Promise<Team[]> {
    try {
      if (ids.length === 0) {
        return [];
      }

      const idsString = ids.map(() => "?").join(", ");
      const [rows] = await this.db.query<(TeamRow & RowDataPacket)[]>(
        sql`
          SELECT id, name
          FROM teams
          WHERE id IN (${idsString}) AND deleted_at IS NULL                                                                                                                                                                                                                                                                                                                                     
          ORDER BY name ASC;
        `,
        ids
      );

      return mapRowsToTeams(rows);
    } catch (err) {
      console.log("TeamRepository.findByIds", err);
      throw err;
    }
  }

  async create(dto: TeamCreateDto): Promise<Team | null> {
    try {
      const { name } = dto;
      const [result] = await this.db.query<ResultSetHeader>(
        sql`
          INSERT INTO teams (name)
          VALUES (?)
        `,
        [name]
      );

      return await this.findById(result.insertId);
    } catch (err) {
      console.log("TeamRepository.create", err);
      throw err;
    }
  }

  async update(id: TeamParamsDto["id"], dto: TeamUpdateDto): Promise<Team | null> {
    try {
      const { name } = dto;
      const [result] = await this.db.query<TeamRow & ResultSetHeader>(
        sql`
          UPDATE teams
          SET name = ?
          WHERE id = ? AND deleted_at IS NULL;
        `,
        [name, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return this.findById(id);
    } catch (err) {
      console.log("TeamRepository.update", err);
      throw err;
    }
  }

  async delete(id: TeamParamsDto["id"]): Promise<TeamParamsDto["id"] | null> {
    try {
      const [result] = await this.db.query<ResultSetHeader>(
        sql`
        UPDATE teams
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
      console.log("TeamRepository.delete", err);
      throw err;
    }
  }
}

export const teamRepo = new TeamRepository(pool);
