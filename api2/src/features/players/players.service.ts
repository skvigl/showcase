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
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersQueryDto } from './dto/players-query.dto';
import { PlayerResponseDto } from './dto/player-response.dto';
import { PlayersRepository } from './players.repository';
import { mapToDto, mapToPaginatedDto } from 'src/shared/helpers/mapper';
import { PlayersResponseDto } from './dto/players-response.dto';

@Injectable()
export class PlayersService {
  constructor(private playersRepository: PlayersRepository) {}

  async create(
    createPlayerDto: CreatePlayerDto,
  ): Promise<
    | SuccessServiceResult<PlayerResponseDto>
    | FailedServiceResult
    | FatalServiceResult
  > {
    const result = await this.playersRepository.create(createPlayerDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(mapToDto(PlayerResponseDto, result.data));
      case 'constraint':
        return failedServiceResult();
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findAll(
    query: PlayersQueryDto,
  ): Promise<SuccessServiceResult<PlayersResponseDto> | FatalServiceResult> {
    const result = await this.playersRepository.findAll(query);

    switch (result.status) {
      case 'success': {
        return successServiceResult(
          mapToPaginatedDto(PlayerResponseDto, result.data),
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
    | SuccessServiceResult<PlayerResponseDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.playersRepository.findOne(id);

    switch (result.status) {
      case 'success': {
        return successServiceResult(mapToDto(PlayerResponseDto, result.data));
      }
      case 'not_found':
        return notFoundServiceResult('Player', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async update(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<
    | SuccessServiceResult<null>
    | FailedServiceResult
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.playersRepository.update(id, updatePlayerDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'constraint':
        return failedServiceResult();
      case 'not_found':
        return notFoundServiceResult('Player', id);
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
    const result = await this.playersRepository.remove(id);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'not_found':
        return notFoundServiceResult('Player', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }
}
