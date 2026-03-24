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
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsQueryDto } from './dto/teams-query.dto';
import { TeamWebDto } from './dto/web/team-web.dto';
import { TeamsWebDto } from './dto/web/teams-web.dto';
import { TeamQueryDto } from './dto/team-query.dto';
import { TeamFeaturedMatchesWebDto } from './dto/web/team-featured-matches-web.dto';
import { TeamsRepository } from './teams.repository';
import { mapToPublicDto, mapToPaginatedDto } from 'src/shared/helpers/mapper';
import { MatchesService } from '@features/matches/matches.service';
import { MatchStatus } from '@features/matches/dto/create-match.dto';
import { TeamLastResultsWebDto } from './dto/web/team-last-results-web.dto';

@Injectable()
export class TeamsService {
  constructor(
    private readonly teamsRepository: TeamsRepository,
    private readonly matchService: MatchesService,
  ) {}

  async create(
    createTeamDto: CreateTeamDto,
  ): Promise<
    SuccessServiceResult<TeamWebDto> | FailedServiceResult | FatalServiceResult
  > {
    const result = await this.teamsRepository.create(createTeamDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(mapToPublicDto(TeamWebDto, result.data));
      case 'constraint':
        return failedServiceResult();
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findAll(
    query: TeamsQueryDto,
  ): Promise<SuccessServiceResult<TeamsWebDto> | FatalServiceResult> {
    const result = await this.teamsRepository.findAll(query);

    switch (result.status) {
      case 'success': {
        return successServiceResult(mapToPaginatedDto(TeamWebDto, result.data));
      }
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findOneById(
    id: string,
    query: TeamQueryDto,
  ): Promise<
    | SuccessServiceResult<TeamWebDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.teamsRepository.findOne(id, query);

    switch (result.status) {
      case 'success': {
        return successServiceResult(mapToPublicDto(TeamWebDto, result.data));
      }
      case 'not_found':
        return notFoundServiceResult('Team', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async update(
    id: string,
    updateTeamDto: UpdateTeamDto,
  ): Promise<
    | SuccessServiceResult<null>
    | FailedServiceResult
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.teamsRepository.update(id, updateTeamDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'constraint':
        return failedServiceResult();
      case 'not_found':
        return notFoundServiceResult('Team', id);
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
    const result = await this.teamsRepository.remove(id);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'not_found':
        return notFoundServiceResult('Team', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findLastResults(
    id: string,
    eventId: string,
    limit = 10,
  ): Promise<
    | SuccessServiceResult<TeamLastResultsWebDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.findOneById(id, {});

    if (result.status !== 'success') {
      return result;
    }

    const matchResult = await this.matchService.findByFilters({
      eventId,
      teamId: id,
      statuses: [MatchStatus.finished],
      limit: limit,
      order: 'asc',
    });

    if (matchResult.status !== 'success') {
      return matchResult;
    }

    const matches = matchResult.data;
    const featured = matches
      .map((m) => {
        const { homeTeamId, homeTeamScore, awayTeamId, awayTeamScore } = m;

        if (!homeTeamId || !awayTeamId) {
          return null;
        }

        let result: 'W' | 'L' | 'D' = 'L';

        if (homeTeamScore === awayTeamScore) {
          result = 'D';
        } else if (
          (homeTeamId === id && homeTeamScore > awayTeamScore) ||
          (awayTeamId === id && awayTeamScore > homeTeamScore)
        ) {
          result = 'W';
        }

        return {
          ...m,
          result,
        };
      })
      .filter((m) => m !== null)
      .slice(-limit);

    return successServiceResult({
      items: featured,
    });
  }

  async findFeaturedMatches(
    id: string,
    eventId: string,
    limit = 10,
  ): Promise<
    | SuccessServiceResult<TeamFeaturedMatchesWebDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.findOneById(id, {});

    if (result.status !== 'success') {
      return result;
    }

    const matchResult = await this.matchService.findByFilters({
      eventId,
      teamId: id,
      statuses: [MatchStatus.live, MatchStatus.scheduled],
      limit: limit,
      order: 'asc',
    });

    if (matchResult.status !== 'success') {
      return matchResult;
    }

    const featured = [
      ...matchResult.data.filter((m) => m.status === MatchStatus.live),
      ...matchResult.data.filter((m) => m.status === MatchStatus.scheduled),
    ];

    return successServiceResult({
      items: featured,
    });
  }
}
