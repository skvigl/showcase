import { failedResult, handleDbError, notFoundResult, successResult } from "../../utils/serviceResult.js";
import { eventService } from "../events/event.service.js";
import { teamService } from "../teams/team.service.js";
import { matchRepo } from "./match.repository.js";
import { attachTeamNames, collectTeamIds } from "./match.utils.js";
import { createCacheProvider, ICacheProvider } from "../../cache.provider.js";
import type { ServiceResult } from "../../utils/serviceResult.js";
import type { MatchCreateDto, MatchParamsDto, MatchUpdateDto } from "./match.schema.js";
import type { Match } from "../../types/match.js";

export class MatchService {
  constructor(private cache: ICacheProvider) {
    this.cache = cache;
  }

  async getAll(): Promise<ServiceResult<Match[]>> {
    try {
      const key = `matches:list`;
      const cached = await this.cache.get<Match[]>(key);

      if (cached) {
        return successResult(cached);
      }

      const baseMatches = await matchRepo.findAll();
      const teamIds = collectTeamIds(baseMatches);

      const result = await teamService.getByIds(teamIds);

      if (result.status !== "success") {
        throw result;
      }

      const teamMap = result.data;
      const matches: Match[] = attachTeamNames(baseMatches, teamMap);

      await this.cache.set(key, matches, 30);

      return successResult(matches);
    } catch (err) {
      return handleDbError("MatchService.getAll", err);
    }
  }

  async getById(id: MatchParamsDto["id"]): Promise<ServiceResult<Match>> {
    try {
      const key = `matches:${id}`;
      const cached = await this.cache.get<Match>(key);

      if (cached) {
        return successResult(cached);
      }

      const baseMatch = await matchRepo.findById(id);

      if (!baseMatch) {
        return notFoundResult("Match", id);
      }

      const teamIds = collectTeamIds([baseMatch]);
      const result = await teamService.getByIds(teamIds);

      if (result.status !== "success") {
        throw result;
      }

      const teamMap = result.data;
      const match: Match[] = attachTeamNames([baseMatch], teamMap);

      await this.cache.set(key, match[0], 30);

      return successResult(match[0]);
    } catch (err) {
      return handleDbError("MatchService.getById", err);
    }
  }

  async getByTeamId(teamId: number): Promise<ServiceResult<Match[]>> {
    try {
      const key = `matches:team:${teamId}`;
      const cached = await this.cache.get<Match[]>(key);

      if (cached) {
        return successResult(cached);
      }

      const baseMatches = await matchRepo.findByTeamId(teamId);
      const teamIds = collectTeamIds(baseMatches);
      const result = await teamService.getByIds(teamIds);

      if (result.status !== "success") {
        throw result;
      }

      const teamMap = result.data;
      const matches: Match[] = attachTeamNames(baseMatches, teamMap);

      await this.cache.set(key, matches, 30);

      return successResult(matches);
    } catch (err) {
      return handleDbError("MatchService.getByTeamId", err);
    }
  }

  async getByEventId(eventId: number): Promise<ServiceResult<Match[]>> {
    try {
      const key = `matches:event:${eventId}`;
      const cached = await this.cache.get<Match[]>(key);

      if (cached) {
        return successResult(cached);
      }

      const baseMatches = await matchRepo.findByEventId(eventId);
      const teamIds = collectTeamIds(baseMatches);
      const result = await teamService.getByIds(teamIds);

      if (result.status !== "success") {
        throw result;
      }

      const teamMap = result.data;
      const matches: Match[] = attachTeamNames(baseMatches, teamMap);

      await this.cache.set(key, matches, 30);

      return successResult(matches);
    } catch (err) {
      return handleDbError("MatchService.getByEventId", err);
    }
  }

  async create(dto: MatchCreateDto): Promise<ServiceResult<Match>> {
    const { eventId, homeTeamId, awayTeamId } = dto;

    try {
      const result = await eventService.getById(eventId);

      if (result.status === "not_found") {
        return failedResult(`Event with eventId=${eventId} not found`);
      }

      if (result.status !== "success") {
        throw result;
      }
    } catch (err) {
      return handleDbError("MatchService.create", err);
    }

    try {
      const result = await teamService.getByIds([homeTeamId, awayTeamId]);

      if (result.status !== "success") {
        throw result;
      }

      const teamMap = result.data;
      const home = teamMap.get(homeTeamId);
      const away = teamMap.get(awayTeamId);

      if (!home || !away) {
        return failedResult(`Invalid teamId(s): ${homeTeamId}, ${awayTeamId}`);
      }

      const baseMatch = await matchRepo.create(dto);

      if (!baseMatch) {
        return failedResult("Can not create match");
      }

      const match = attachTeamNames([baseMatch], teamMap);

      return successResult(match[0]);
    } catch (err) {
      return handleDbError("MatchService.create", err);
    }
  }

  async update(id: MatchParamsDto["id"], dto: MatchUpdateDto): Promise<ServiceResult<null>> {
    const { eventId, homeTeamId, awayTeamId } = dto;

    if (eventId !== undefined) {
      try {
        const result = await eventService.getById(eventId);

        if (result.status === "not_found") {
          return failedResult(`Event with eventId=${eventId} not found`);
        }

        if (result.status !== "success") {
          throw result;
        }
      } catch (err) {
        return handleDbError("MatchService.update", err);
      }
    }

    if (homeTeamId !== undefined) {
      try {
        const result = await teamService.getById(homeTeamId);

        if (result.status === "not_found") {
          return failedResult(`Team with homeTeamId=${eventId} not found`);
        }

        if (result.status !== "success") {
          throw result;
        }
      } catch (err) {
        return handleDbError("MatchService.update", err);
      }
    }

    if (awayTeamId !== undefined) {
      try {
        const result = await teamService.getById(awayTeamId);

        if (result.status === "not_found") {
          return failedResult(`Team with homeTeamId=${eventId} not found`);
        }

        if (result.status !== "success") {
          throw result;
        }
      } catch (err) {
        return handleDbError("MatchService.update", err);
      }
    }

    try {
      const match = matchRepo.update(id, dto);

      if (!match) {
        return notFoundResult("Match", id);
      }

      await this.cache.del([`match:${id}`]);

      return successResult(null);
    } catch (err) {
      return handleDbError("MatchService.update", err);
    }
  }
}

export const matchService = new MatchService(createCacheProvider());
