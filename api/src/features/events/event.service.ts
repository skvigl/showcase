import { failedResult, handleDbError, notFoundResult, successResult } from "../../utils/serviceResult.js";
import type { ServiceResult } from "../../utils/serviceResult.js";
import { matchService } from "../matches/match.service.js";
import { teamService } from "../teams/team.service.js";
import { eventRepo } from "./event.repository.js";
import type { EventCreateDto, EventParamsDto, EventUpdateDto } from "./event.schema.js";
import type { Team, TeamWithPoints } from "../../types/team.js";
import type { Event } from "../../types/event.js";
import type { Match } from "../../types/match.js";

class EventService {
  async getAll(): Promise<ServiceResult<Event[]>> {
    try {
      const events = await eventRepo.findAll();

      return successResult(events);
    } catch (err) {
      return handleDbError("EventService.getAll", err);
    }
  }

  async getById(id: EventParamsDto["id"]): Promise<ServiceResult<Event>> {
    try {
      const event = await eventRepo.findById(id);

      if (!event) {
        return notFoundResult("Event", id);
      }

      return successResult(event);
    } catch (err) {
      return handleDbError("EventService.getById", err);
    }
  }

  async create(dto: EventCreateDto): Promise<ServiceResult<Event>> {
    try {
      const event = await eventRepo.create(dto);

      if (!event) {
        return failedResult("Can not create event");
      }

      return successResult(event);
    } catch (err) {
      return handleDbError("EventService.create", err);
    }
  }

  async update(id: EventParamsDto["id"], dto: EventUpdateDto): Promise<ServiceResult<null>> {
    try {
      const event = await eventRepo.update(id, dto);

      if (!event) {
        return notFoundResult("Event", id);
      }

      return successResult(null);
    } catch (err) {
      return handleDbError("EventService.update", err);
    }
  }

  async delete(id: EventParamsDto["id"]): Promise<ServiceResult<null>> {
    try {
      const result = await eventRepo.delete(id);

      if (result === null) {
        return notFoundResult("Event", id);
      }

      return successResult(null);
    } catch (err) {
      return handleDbError("EventService.delete", err);
    }
  }

  async getEventTeams(id: EventParamsDto["id"]): Promise<ServiceResult<Team[]>> {
    try {
      const matchResult = await matchService.getByEventId(id);

      if (matchResult.status !== "success") {
        throw matchResult;
      }

      const matches = matchResult.data;
      const teamIds = [...new Set(matches.flatMap((m) => [m.home.id, m.away.id]))];
      const teamResult = await teamService.getByIds(teamIds);

      if (teamResult.status !== "success") {
        throw teamResult;
      }

      const teams = [...teamResult.data.values()];

      return successResult(teams);
    } catch (err) {
      return handleDbError("EventService.getEventTeams", err);
    }
  }

  async getEventFeaturedMatches(id: EventParamsDto["id"], limit = 6): Promise<ServiceResult<Match[]>> {
    try {
      const result = await matchService.getByEventId(id);

      if (result.status !== "success") {
        throw result;
      }

      const matches = result.data;
      const finishedMatches = matches.filter((m) => m.status == "finished");
      const liveMatches = matches.filter((m) => m.status == "live");
      const scheduledMatches = matches.filter((m) => m.status == "scheduled");
      let featured = [...liveMatches, ...scheduledMatches.slice(0, limit - liveMatches.length)];

      if (featured.length < limit) {
        featured = [...finishedMatches.slice(-(limit - featured.length)), ...featured];
      }

      return successResult(featured);
    } catch (err) {
      return handleDbError("EventService.getEventFeaturedMatches", err);
    }
  }

  async getEventLeaderboard(id: EventParamsDto["id"], limit = 10): Promise<ServiceResult<TeamWithPoints[]>> {
    try {
      const result = await matchService.getByEventId(id);

      if (result.status !== "success") {
        throw result;
      }

      const matches = result.data;
      const finishedMatches = matches.filter((m) => m.status == "finished");
      const teamIds = [...new Set(matches.flatMap((m) => [m.home.id, m.away.id]))];

      const leaderBoard = new Map(teamIds.map((id) => [id, 0]));

      for (const fm of finishedMatches) {
        const { home, away } = fm;

        let homePoints = 0,
          awayPoints = 0;

        if (home.score === away.score) {
          homePoints = 1;
          awayPoints = 1;
        } else if (home.score > away.score) {
          homePoints = 3;
        } else {
          awayPoints = 3;
        }

        leaderBoard.set(home.id, (leaderBoard.get(home.id) || 0) + homePoints);
        leaderBoard.set(away.id, (leaderBoard.get(away.id) || 0) + awayPoints);
      }

      const sorted = [...leaderBoard.entries()].sort((a, b) => b[1] - a[1]);
      const topN = sorted.slice(0, limit);

      const teamResult = await teamService.getByIds(topN.map(([id]) => id));

      if (teamResult.status !== "success") {
        throw teamResult;
      }

      const teamMap = teamResult.data;
      const teamWithPoints = [...teamMap.values()]
        .map((team) => {
          const points = leaderBoard.get(team.id) || 0;
          return { ...team, points };
        })
        .sort((a, b) => b.points - a.points);

      return successResult(teamWithPoints);
    } catch (err) {
      return handleDbError("EventService.getEventLeaderboard", err);
    }
  }
}

export const eventService = new EventService();
