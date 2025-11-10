import { failedResult, handleDbError, notFoundResult, successResult } from "../../utils/serviceResult.js";
import type { ServiceResult } from "../../utils/serviceResult.js";
import { playerRepo } from "./player.repository.js";
import type { TeamParamsDto } from "../teams/team.schema.js";
import type { PlayerCreateDto, PlayerParamsDto, PlayerQueryDto, PlayerUpdateDto } from "./player.schema.js";
import type { Player } from "../../types/player.js";

export class PlayerService {
  async getAll(dto: PlayerQueryDto): Promise<ServiceResult<Player[]>> {
    try {
      const players = await playerRepo.findAll(dto);

      return successResult(players);
    } catch (err) {
      return handleDbError("PlayerService.getAll", err);
    }
  }

  async getById(id: PlayerParamsDto["id"]): Promise<ServiceResult<Player>> {
    try {
      const player = await playerRepo.findById(id);

      if (!player) {
        return notFoundResult("Player", id);
      }

      return successResult(player);
    } catch (err) {
      return handleDbError("PlayerService.getById", err);
    }
  }

  async getByTeamId(teamId: TeamParamsDto["id"]): Promise<ServiceResult<Player[]>> {
    try {
      const players = await playerRepo.findByTeamId(teamId);

      return successResult(players);
    } catch (err) {
      return handleDbError("PlayerService.getByTeamId", err);
    }
  }

  async create(dto: PlayerCreateDto): Promise<ServiceResult<Player>> {
    try {
      const player = await playerRepo.create(dto);

      if (!player) {
        return failedResult("Can not create player");
      }

      return successResult(player);
    } catch (err) {
      return handleDbError("PlayerService.create", err);
    }
  }

  async update(id: PlayerParamsDto["id"], dto: PlayerUpdateDto): Promise<ServiceResult<null>> {
    try {
      const player = await playerRepo.update(id, dto);

      if (!player) {
        return notFoundResult("Player", id);
      }

      return successResult(null);
    } catch (err) {
      return handleDbError("PlayerService.update", err);
    }
  }

  async delete(id: PlayerParamsDto["id"]): Promise<ServiceResult<null>> {
    try {
      const result = await playerRepo.delete(id);

      if (result === null) {
        return notFoundResult("Player", id);
      }

      return successResult(null);
    } catch (err) {
      return handleDbError("PlayerService.delete", err);
    }
  }
}

export const playerService = new PlayerService();
