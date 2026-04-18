import { Injectable } from '@nestjs/common';
import { CreateMatchDto, MatchStatus } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchesQueryDto } from './dto/matches-query.dto';
import {
  FailedServiceResult,
  FatalServiceResult,
  failedServiceResult,
  fatalServiceResult,
  NotFoundServiceResult,
  notFoundServiceResult,
  SuccessServiceResult,
  successServiceResult,
} from 'src/shared/types/service-result';
import {
  mapToPublicDto,
  mapToPaginatedDto,
  mapToDtoArray,
} from 'src/shared/helpers/mapper';
import { MatchWebDto } from './dto/match-web.dto';
import { MatchesWebDto } from './dto/matches-web.dto';
import { MatchesRepository } from './matches.repository';
import { MatchQueryDto } from './dto/match-query.dto';

@Injectable()
export class MatchesService {
  constructor(private readonly matchesRepository: MatchesRepository) {}

  async create(
    createMatchDto: CreateMatchDto,
  ): Promise<
    SuccessServiceResult<MatchWebDto> | FailedServiceResult | FatalServiceResult
  > {
    const result = await this.matchesRepository.create(createMatchDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(mapToPublicDto(MatchWebDto, result.data));
      case 'constraint':
        return failedServiceResult();
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findAll(
    query: MatchesQueryDto,
  ): Promise<SuccessServiceResult<MatchesWebDto> | FatalServiceResult> {
    const result = await this.matchesRepository.findAll(query);

    switch (result.status) {
      case 'success':
        return successServiceResult(
          mapToPaginatedDto(MatchWebDto, result.data),
        );
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findOneById(
    id: string,
    query: MatchQueryDto,
  ): Promise<
    | SuccessServiceResult<MatchWebDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.matchesRepository.findOne(id, query);

    switch (result.status) {
      case 'success': {
        return successServiceResult(mapToPublicDto(MatchWebDto, result.data));
      }
      case 'not_found':
        return notFoundServiceResult('Match', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async update(
    id: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<
    | SuccessServiceResult<null>
    | FailedServiceResult
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.matchesRepository.update(id, updateMatchDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'constraint':
        return failedServiceResult();
      case 'not_found':
        return notFoundServiceResult('Match', id);
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
    const result = await this.matchesRepository.remove(id);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'not_found':
        return notFoundServiceResult('Match', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findByFilters(filters: {
    tournamentId?: string;
    teamId?: string;
    statuses?: MatchStatus[];
    limit?: number;
    order?: 'asc' | 'desc';
  }) {
    const result = await this.matchesRepository.findByFilters(filters);

    switch (result.status) {
      case 'success':
        return successServiceResult(mapToDtoArray(MatchWebDto, result.data));
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }
}
