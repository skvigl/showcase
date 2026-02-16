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
import { UserWebDto } from './dto/user-web.dto';
import { UserInternalDto } from './dto/user-internal.dto';
import { UsersRepository } from './users.repository';
import {
  mapToPublicDto,
  mapToPaginatedDto,
  mapToInternalDto,
} from 'src/shared/helpers/mapper';
import { UsersResponseDto } from './dto/users-response.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<
    SuccessServiceResult<UserWebDto> | FailedServiceResult | FatalServiceResult
  > {
    const result = await this.usersRepository.create(createUserDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(mapToPublicDto(UserWebDto, result.data));
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
        return successServiceResult(mapToPaginatedDto(UserWebDto, result.data));
      }
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findOneById(
    id: string,
  ): Promise<
    | SuccessServiceResult<UserWebDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.usersRepository.findOneById(id);

    switch (result.status) {
      case 'success': {
        return successServiceResult(mapToPublicDto(UserWebDto, result.data));
      }
      case 'not_found':
        return notFoundServiceResult('User', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findOneByEmail(
    email: string,
  ): Promise<
    | SuccessServiceResult<UserInternalDto>
    | FailedServiceResult
    | FatalServiceResult
  > {
    const result = await this.usersRepository.findOneByEmail(email);

    switch (result.status) {
      case 'success': {
        return successServiceResult(
          mapToInternalDto(UserInternalDto, result.data),
        );
      }
      case 'not_found':
        return failedServiceResult('User not found');
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<
    | SuccessServiceResult<UserWebDto>
    | FailedServiceResult
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.usersRepository.update(id, updateUserDto);

    switch (result.status) {
      case 'success': {
        return successServiceResult(mapToPublicDto(UserWebDto, result.data));
      }
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
