import { failedResult, handleServiceError, notFoundResult, successResult } from "../../utils/serviceResult.js";
import { playerService } from "../players/player.service.js";
import { matchService } from "../matches/match.service.js";
import { teamRepo } from "./team.repository.js";
import { ICacheProvider, createCacheProvider } from "../../cache.provider.js";
import type { ServiceResult } from "../../utils/serviceResult.js";
import type { TeamCreateDto, TeamParamsDto, TeamUpdateDto } from "./team.schema.js";
import type { Team, TeamLastResult } from "../../types/team.js";
import type { Player } from "../../types/player.js";
import type { Match } from "../../types/match.js";

export class TeamService {
  constructor(private cache: ICacheProvider) {
    this.cache = cache;
  }

  async getAll(): Promise<ServiceResult<Team[]>> {
    return handleServiceError(async () => {
      const key = `teams:list`;
      const cached = await this.cache.get<Team[]>(key);

      if (cached) {
        return successResult(cached);
      }

      const teams = await teamRepo.findAll();

      await this.cache.set(key, teams, 60);

      return successResult(teams);
    }, "TeamService.getAll");
  }

  async getById(id: TeamParamsDto["id"]): Promise<ServiceResult<Team>> {
    return handleServiceError(async () => {
      const key = `teams:${id}`;
      const cached = await this.cache.get<Team>(key);

      if (cached) {
        return successResult(cached);
      }

      const team = await teamRepo.findById(id);

      if (!team) {
        return notFoundResult("Team", id);
      }

      await this.cache.set(key, team, 60);

      return successResult(team);
    }, "TeamService.getById");
  }

  async getByIds(ids: number[]) {
    return handleServiceError(async () => {
      const teams = await teamRepo.findByIds(ids);
      const teamMap = new Map<number, Team>();

      for (const team of teams) {
        teamMap.set(team.id, team);
      }

      return successResult(teamMap);
    }, "TeamService.getByIds");
  }

  async create(dto: TeamCreateDto): Promise<ServiceResult<Team>> {
    return handleServiceError(async () => {
      const team = await teamRepo.create(dto);

      if (!team) {
        return failedResult("Can not create team");
      }

      return successResult(team);
    }, "TeamService.create");
  }

  async update(id: TeamParamsDto["id"], dto: TeamUpdateDto): Promise<ServiceResult<null>> {
    return handleServiceError(async () => {
      const team = await teamRepo.update(id, dto);

      if (!team) {
        return notFoundResult("Team", id);
      }

      await this.cache.del([`teams:${id}`]);

      return successResult(null);
    }, "TeamService.update");
  }

  async delete(id: TeamParamsDto["id"]): Promise<ServiceResult<null>> {
    return handleServiceError(async () => {
      const result = await teamRepo.delete(id);

      if (result === null) {
        return notFoundResult("Team", id);
      }

      await this.cache.del([`teams:${id}`]);

      return successResult(null);
    }, "TeamService.delete");
  }

  async getPlayers(id: TeamParamsDto["id"]): Promise<ServiceResult<Player[]>> {
    return handleServiceError(async () => {
      const team = await teamRepo.findById(id);

      if (!team) {
        return notFoundResult("Team", id);
      }

      const players = await playerService.getByTeamId(id);

      return players;
    }, "TeamService.getPlayers");
  }

  async getLastResults(id: TeamParamsDto["id"], limit = 5): Promise<ServiceResult<TeamLastResult[]>> {
    return handleServiceError(async () => {
      const key = `teams:${id}:last-results`;
      const cached = await this.cache.get<TeamLastResult[]>(key);

      if (cached) {
        return successResult(cached);
      }

      const team = await teamRepo.findById(id);

      if (!team) {
        return notFoundResult("Team", id);
      }

      const result = await matchService.getByTeamId(id);

      if (result.status !== "success") throw result;

      const matches = result.data;
      const finishedMatches = matches.filter((m) => m.status === "finished");
      const teamLastResults: TeamLastResult[] = finishedMatches
        .map((fm) => {
          const { home, away } = fm;
          let result: TeamLastResult["result"] = "L";

          if (typeof home.score !== "number" || typeof away.score !== "number") {
            return null;
          }

          if (home.score === away.score) {
            result = "D";
          } else if (
            (home.id === team.id && home.score > away.score) ||
            (away.id === team.id && away.score > home.score)
          ) {
            result = "W";
          }

          return {
            ...fm,
            result,
          };
        })
        .filter((m) => m !== null)
        .slice(-limit);

      await this.cache.set(key, teamLastResults, 60);

      return successResult(teamLastResults);
    }, "TeamService.getLastResults");
  }

  async getFeaturedMatches(id: TeamParamsDto["id"], limit = 6): Promise<ServiceResult<Match[]>> {
    return handleServiceError(async () => {
      const key = `teams:${id}:featured-matches`;
      const cached = await this.cache.get<Match[]>(key);

      if (cached) {
        return successResult(cached);
      }

      const team = await teamRepo.findById(id);

      if (!team) {
        return notFoundResult("Team", id);
      }

      const result = await matchService.getByTeamId(id);

      if (result.status !== "success") throw result;

      const matches = result.data;
      const live = matches.filter((m) => m.status == "live");
      const scheduled = matches.filter((m) => m.status == "scheduled");
      const featured = live.concat(scheduled.slice(0, limit - live.length));

      await this.cache.set(key, featured, 60);

      return successResult(featured);
    }, "TeamService.getFeaturedMatches");
  }
}

export const teamService = new TeamService(createCacheProvider());
