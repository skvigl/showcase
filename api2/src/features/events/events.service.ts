import { Injectable } from '@nestjs/common';

import {
  FatalServiceResult,
  fatalServiceResult,
  NotFoundServiceResult,
  SuccessServiceResult,
  successServiceResult,
  notFoundServiceResult,
  FailedServiceResult,
  failedServiceResult,
} from 'src/shared/types/service-result';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsQueryDto } from './dto/events-query.dto';
import { EventWebDto } from './dto/web/event-web.dto';
import { EventsRepository } from './events.repository';
import { mapToPublicDto, mapToPaginatedDto } from 'src/shared/helpers/mapper';
import { MatchWebDto } from '@features/matches/dto/match-web.dto';
import { MatchStatus } from '@features/matches/dto/create-match.dto';
import { EventsWebDto } from './dto/web/events-web.dto';
import {
  EventLeaderboardWebDto,
  LeaderboardItemWebDto,
} from './dto/web/event-leaderboard-web.dto';
import { EventFeaturedMatchesWebDto } from './dto/web/event-featured-matches-web.dto';
import { TeamsService } from '@features/teams/teams.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly teamsService: TeamsService,
  ) {}

  private selectFeaturedMatches(
    matches: MatchWebDto[],
    limit: number,
  ): MatchWebDto[] {
    const finished: MatchWebDto[] = [];
    const live: MatchWebDto[] = [];
    const scheduled: MatchWebDto[] = [];

    for (const match of matches) {
      if (match.status === MatchStatus.finished) finished.push(match);
      else if (match.status === MatchStatus.live) live.push(match);
      else if (match.status === MatchStatus.scheduled) scheduled.push(match);
    }

    const minFinished = Math.min(2, finished.length);

    let takeFinished = minFinished;

    const takeLive = Math.min(live.length, limit - takeFinished);

    const takeScheduled = Math.min(
      scheduled.length,
      limit - takeFinished - takeLive,
    );

    const remaining = limit - takeFinished - takeLive - takeScheduled;

    if (remaining > 0) {
      takeFinished = Math.min(finished.length, takeFinished + remaining);
    }

    return [
      ...finished.slice(-takeFinished),
      ...live.slice(0, takeLive),
      ...scheduled.slice(0, takeScheduled),
    ];
  }

  async create(
    createEventDto: CreateEventDto,
  ): Promise<
    SuccessServiceResult<EventWebDto> | FailedServiceResult | FatalServiceResult
  > {
    const result = await this.eventsRepository.create(createEventDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(mapToPublicDto(EventWebDto, result.data));
      case 'constraint':
        return failedServiceResult();
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findAll(
    query: EventsQueryDto,
  ): Promise<SuccessServiceResult<EventsWebDto> | FatalServiceResult> {
    const result = await this.eventsRepository.findAll(query);

    switch (result.status) {
      case 'success': {
        return successServiceResult(
          mapToPaginatedDto(EventWebDto, result.data),
        );
      }
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findOneById(
    id: string,
  ): Promise<
    | SuccessServiceResult<EventWebDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.eventsRepository.findOne(id);

    switch (result.status) {
      case 'success': {
        return successServiceResult(mapToPublicDto(EventWebDto, result.data));
      }
      case 'not_found':
        return notFoundServiceResult('Event', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<
    | SuccessServiceResult<null>
    | FailedServiceResult
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.eventsRepository.update(id, updateEventDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'constraint':
        return failedServiceResult();
      case 'not_found':
        return notFoundServiceResult('Event', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async remove(
    id: string,
  ): Promise<
    SuccessServiceResult<null> | NotFoundServiceResult | FatalServiceResult
  > {
    const result = await this.eventsRepository.remove(id);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'not_found':
        return notFoundServiceResult('Event', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async getLeaderboard(
    id: string,
    limit = 10,
  ): Promise<
    | SuccessServiceResult<EventLeaderboardWebDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.eventsRepository.findOneWithMatches(id);

    switch (result.status) {
      case 'success': {
        const eventWithMatches = result.data;
        const matches = eventWithMatches.matches ?? [];

        const table: Record<string, number> = {};

        for (const match of matches) {
          if (match.status !== MatchStatus.finished) continue;
          if (!match.homeTeamId || !match.awayTeamId) continue;

          const { homeTeamId, awayTeamId, homeTeamScore, awayTeamScore } =
            match;

          table[homeTeamId] = table[homeTeamId] ?? 0;
          table[awayTeamId] = table[awayTeamId] ?? 0;

          if (homeTeamScore === awayTeamScore) {
            table[homeTeamId] += 1;
            table[awayTeamId] += 1;
          } else if (homeTeamScore > awayTeamScore) {
            table[homeTeamId] += 3;
          } else {
            table[awayTeamId] += 3;
          }
        }

        const teamsResult = await this.teamsService.findAll({});

        if (teamsResult.status !== 'success') {
          return teamsResult;
        }
        const teams = teamsResult.data.items;
        const items: LeaderboardItemWebDto[] = teams
          .map((t) => {
            return { ...t, points: table[t.id] ?? 0 };
          })
          .sort((a, b) => b.points - a.points)
          .slice(0, limit);

        return successServiceResult(
          mapToPublicDto(EventLeaderboardWebDto, { items }),
        );
      }
      case 'not_found':
        return notFoundServiceResult('Event', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async getFeaturedMatches(
    id: string,
    limit = 10,
  ): Promise<
    | SuccessServiceResult<EventFeaturedMatchesWebDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.eventsRepository.findOneWithMatches(id);

    switch (result.status) {
      case 'success': {
        const eventWebDto = mapToPublicDto(EventWebDto, result.data);
        const matches = eventWebDto.matches ?? [];
        const featured = this.selectFeaturedMatches(matches, limit);

        return successServiceResult({
          items: featured,
        });
      }
      case 'not_found':
        return notFoundServiceResult('Event', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }
}
