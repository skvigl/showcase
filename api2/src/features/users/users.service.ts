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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersRepository } from './users.repository';
import { mapToDto, mapToPaginatedDto } from 'src/shared/helpers/mapper';
import { UsersResponseDto } from './dto/users-response.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<
    | SuccessServiceResult<UserResponseDto>
    | FailedServiceResult
    | FatalServiceResult
  > {
    const result = await this.usersRepository.create(createUserDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(mapToDto(UserResponseDto, result.data));
      case 'constraint':
        return failedServiceResult();
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findAll(
    query: UsersQueryDto,
  ): Promise<SuccessServiceResult<UsersResponseDto> | FatalServiceResult> {
    const result = await this.usersRepository.findAll(query);

    switch (result.status) {
      case 'success': {
        return successServiceResult(
          mapToPaginatedDto(UserResponseDto, result.data),
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
    | SuccessServiceResult<UserResponseDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.usersRepository.findOne(id);

    switch (result.status) {
      case 'success': {
        return successServiceResult(mapToDto(UserResponseDto, result.data));
      }
      case 'not_found':
        return notFoundServiceResult('User', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<
    | SuccessServiceResult<null>
    | FailedServiceResult
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.usersRepository.update(id, updateUserDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'constraint':
        return failedServiceResult();
      case 'not_found':
        return notFoundServiceResult('User', id);
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
    const result = await this.usersRepository.remove(id);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'not_found':
        return notFoundServiceResult('User', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }
}
