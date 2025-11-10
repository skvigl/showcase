import { failedResult, handleDbError, notFoundResult, successResult } from "../../utils/serviceResult.js";
import type { ServiceResult } from "../../utils/serviceResult.js";
import { playerService } from "../players/player.service.js";
import { matchService } from "../matches/match.service.js";
import { teamRepo } from "./team.repository.js";
import type { TeamCreateDto, TeamParamsDto, TeamUpdateDto } from "./team.schema.js";
import type { Team, TeamLastResult } from "../../types/team.js";
import type { Player } from "../../types/player.js";
import type { Match } from "../../types/match.js";

export class TeamService {
  async getAll(): Promise<ServiceResult<Team[]>> {
    try {
      const teams = await teamRepo.findAll();

      return successResult(teams);
    } catch (err) {
      return handleDbError("TeamService.getAll", err);
    }
  }

  async getById(id: TeamParamsDto["id"]): Promise<ServiceResult<Team>> {
    try {
      const team = await teamRepo.findById(id);

      if (!team) {
        return notFoundResult("Team", id);
      }

      return successResult(team);
    } catch (err) {
      return handleDbError("TeamService.getById", err);
    }
  }

  async getByIds(ids: number[]) {
    try {
      const teams = await teamRepo.findByIds(ids);
      const teamMap = new Map<number, Team>();

      for (const team of teams) {
        teamMap.set(team.id, team);
      }

      return successResult(teamMap);
    } catch (err) {
      return handleDbError("TeamService.getByIds", err);
    }
  }

  async create(dto: TeamCreateDto): Promise<ServiceResult<Team>> {
    try {
      const team = await teamRepo.create(dto);

      if (!team) {
        return failedResult("Can not create team");
      }

      return successResult(team);
    } catch (err) {
      return handleDbError("TeamService.create", err);
    }
  }

  async update(id: TeamParamsDto["id"], dto: TeamUpdateDto): Promise<ServiceResult<null>> {
    try {
      const team = await teamRepo.update(id, dto);

      if (!team) {
        return notFoundResult("Team", id);
      }

      return successResult(null);
    } catch (err) {
      return handleDbError("TeamService.update", err);
    }
  }

  async delete(id: TeamParamsDto["id"]): Promise<ServiceResult<null>> {
    try {
      const result = await teamRepo.delete(id);

      if (result === null) {
        return notFoundResult("Team", id);
      }

      return successResult(null);
    } catch (err) {
      return handleDbError("TeamService.delete", err);
    }
  }

  async getPlayers(id: TeamParamsDto["id"]): Promise<ServiceResult<Player[]>> {
    try {
      const team = await teamRepo.findById(id);

      if (!team) {
        return notFoundResult("Team", id);
      }

      return await playerService.getByTeamId(id);
    } catch (err) {
      return handleDbError("TeamService.getPlayers", err);
    }
  }

  async getLastResults(id: TeamParamsDto["id"], limit = 5): Promise<ServiceResult<TeamLastResult[]>> {
    try {
      const team = await teamRepo.findById(id);

      if (!team) {
        return notFoundResult("Team", id);
      }
      const result = await matchService.getByTeamId(id);

      if (result.status !== "success") {
        throw result;
      }

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

      return successResult(teamLastResults);
    } catch (err) {
      return handleDbError("TeamService.getLastResults", err);
    }
  }

  async getFeaturedMatches(id: TeamParamsDto["id"], limit = 6): Promise<ServiceResult<Match[]>> {
    try {
      const team = teamRepo.findById(id);

      if (!team) {
        return notFoundResult("Team", id);
      }

      const result = await matchService.getByTeamId(id);

      if (result.status !== "success") {
        throw result;
      }

      const matches = result.data;
      const liveMatches = matches.filter((m) => m.status == "live");
      const scheduledMatches = matches.filter((m) => m.status == "scheduled");
      const featured = liveMatches.concat(scheduledMatches.slice(0, limit - liveMatches.length));

      return successResult(featured);
    } catch (err) {
      return handleDbError("TeamService.getFeaturedMatches", err);
    }
  }
}

export const teamService = new TeamService();
