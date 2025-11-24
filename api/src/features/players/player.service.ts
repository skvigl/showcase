import { failedResult, handleServiceError, notFoundResult, successResult } from "../../utils/serviceResult.js";
import { playerRepo } from "./player.repository.js";
import { createCacheProvider, ICacheProvider } from "../../cache.provider.js";
import type { ServiceResult } from "../../utils/serviceResult.js";
import type { TeamParamsDto } from "../teams/team.schema.js";
import type { PlayerCreateDto, PlayerParamsDto, PlayerQueryDto, PlayerUpdateDto } from "./player.schema.js";
import type { Player } from "../../types/player.js";

export class PlayerService {
  constructor(private cache: ICacheProvider) {
    this.cache = cache;
  }

  async getAll(dto: PlayerQueryDto): Promise<ServiceResult<Player[]>> {
    return handleServiceError(async () => {
      const players = await playerRepo.findAll(dto);

      return successResult(players);
    }, "PlayerService.getAll");
  }

  async getById(id: PlayerParamsDto["id"]): Promise<ServiceResult<Player>> {
    return handleServiceError(async () => {
      const key = `players:${id}`;
      const cached = await this.cache.get<Player>(key);

      if (cached) {
        return successResult(cached);
      }

      const player = await playerRepo.findById(id);

      if (!player) {
        return notFoundResult("Player", id);
      }

      await this.cache.set(key, player, 60);

      return successResult(player);
    }, "PlayerService.getById");
  }

  async getByTeamId(teamId: TeamParamsDto["id"]): Promise<ServiceResult<Player[]>> {
    return handleServiceError(async () => {
      const key = `players:team:${teamId}`;
      const cached = await this.cache.get<Player[]>(key);

      if (cached) {
        return successResult(cached);
      }

      const players = await playerRepo.findByTeamId(teamId);

      await this.cache.set(key, players, 60);

      return successResult(players);
    }, "PlayerService.getByTeamId");
  }

  async create(dto: PlayerCreateDto): Promise<ServiceResult<Player>> {
    return handleServiceError(async () => {
      const player = await playerRepo.create(dto);

      if (!player) {
        return failedResult("Can not create player");
      }

      return successResult(player);
    }, "PlayerService.create");
  }

  async update(id: PlayerParamsDto["id"], dto: PlayerUpdateDto): Promise<ServiceResult<null>> {
    return handleServiceError(async () => {
      const player = await playerRepo.update(id, dto);

      if (!player) {
        return notFoundResult("Player", id);
      }

      await this.cache.del([`players:${id}`]);

      return successResult(null);
    }, "PlayerService.update");
  }

  async delete(id: PlayerParamsDto["id"]): Promise<ServiceResult<null>> {
    return handleServiceError(async () => {
      const result = await playerRepo.delete(id);

      if (result === null) {
        return notFoundResult("Player", id);
      }

      await this.cache.del([`players:${id}`]);

      return successResult(null);
    }, "PlayerService.delete");
  }
}

export const playerService = new PlayerService(createCacheProvider());
