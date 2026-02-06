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
import { TeamResponseDto } from './dto/team-response.dto';
import { TeamsRepository } from './teams.repository';
import { mapToDto, mapToPaginatedDto } from 'src/shared/helpers/mapper';
import { TeamsResponseDto } from './dto/teams-response.dto';

@Injectable()
export class TeamsService {
  constructor(private teamsRepository: TeamsRepository) {}

  async create(
    createTeamDto: CreateTeamDto,
  ): Promise<
    | SuccessServiceResult<TeamResponseDto>
    | FailedServiceResult
    | FatalServiceResult
  > {
    const result = await this.teamsRepository.create(createTeamDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(mapToDto(TeamResponseDto, result.data));
      case 'constraint':
        return failedServiceResult();
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findAll(
    query: TeamsQueryDto,
  ): Promise<SuccessServiceResult<TeamsResponseDto> | FatalServiceResult> {
    const result = await this.teamsRepository.findAll(query);

    switch (result.status) {
      case 'success': {
        return successServiceResult(
          mapToPaginatedDto(TeamResponseDto, result.data),
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
    | SuccessServiceResult<TeamResponseDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.teamsRepository.findOne(id);

    switch (result.status) {
      case 'success': {
        return successServiceResult(mapToDto(TeamResponseDto, result.data));
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
}
