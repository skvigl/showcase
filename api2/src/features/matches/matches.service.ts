import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
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
import { MatchResponseDto } from './dto/match-response.dto';
import { MatchesResponseDto } from './dto/matches-response.dto';
import { MatchesRepository } from './matches.repository';
import { mapToPublicDto, mapToPaginatedDto } from 'src/shared/helpers/mapper';

@Injectable()
export class MatchesService {
  constructor(private readonly matchesRepository: MatchesRepository) {}

  async create(
    createMatchDto: CreateMatchDto,
  ): Promise<
    | SuccessServiceResult<MatchResponseDto>
    | FailedServiceResult
    | FatalServiceResult
  > {
    const result = await this.matchesRepository.create(createMatchDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(
          mapToPublicDto(MatchResponseDto, result.data),
        );
      case 'constraint':
        return failedServiceResult();
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findAll(
    query: MatchesQueryDto,
  ): Promise<SuccessServiceResult<MatchesResponseDto> | FatalServiceResult> {
    const result = await this.matchesRepository.findAll(query);

    switch (result.status) {
      case 'success':
        return successServiceResult(
          mapToPaginatedDto(MatchResponseDto, result.data),
        );
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findOneById(
    id: string,
  ): Promise<
    | SuccessServiceResult<MatchResponseDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.matchesRepository.findOne(id);

    switch (result.status) {
      case 'success':
        return successServiceResult(
          mapToPublicDto(MatchResponseDto, result.data),
        );
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
}
