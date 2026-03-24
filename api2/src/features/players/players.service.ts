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
import { PlayerWebDto } from './dto/player-web.dto';
import { PlayersRepository } from './players.repository';
import { mapToPublicDto, mapToPaginatedDto } from 'src/shared/helpers/mapper';
import { PlayersWebDto } from './dto/players-web.dto';
import { PlayerQueryDto } from './dto/player-query.dto';

@Injectable()
export class PlayersService {
  constructor(private playersRepository: PlayersRepository) {}

  async create(
    createPlayerDto: CreatePlayerDto,
  ): Promise<
    | SuccessServiceResult<PlayerWebDto>
    | FailedServiceResult
    | FatalServiceResult
  > {
    const result = await this.playersRepository.create(createPlayerDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(mapToPublicDto(PlayerWebDto, result.data));
      case 'constraint':
        return failedServiceResult();
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findAll(
    query: PlayersQueryDto,
  ): Promise<SuccessServiceResult<PlayersWebDto> | FatalServiceResult> {
    const result = await this.playersRepository.findAll(query);

    switch (result.status) {
      case 'success': {
        return successServiceResult(
          mapToPaginatedDto(PlayerWebDto, result.data),
        );
      }
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findOneById(
    id: string,
    query: PlayerQueryDto,
  ): Promise<
    | SuccessServiceResult<PlayerWebDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.playersRepository.findOne(id, query);

    switch (result.status) {
      case 'success': {
        return successServiceResult(mapToPublicDto(PlayerWebDto, result.data));
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
