import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { Prisma, User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  successRepositoryResult,
  fatalRepositoryResult,
  notFoundRepositoryResult,
  constraintRepositoryResult,
  SuccessRepositoryResult,
  ConstraintRepositoryResult,
  FatalRepositoryResult,
  NotFoundRepositoryResult,
} from 'src/shared/types/repository-result';
import { Paginated } from 'src/shared/types/paginations';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_ORDER,
} from 'src/shared/constants/pagination';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersQueryDto } from './dto/users-query.dto';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return hashedPassword;
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<
    | SuccessRepositoryResult<User>
    | ConstraintRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const passwordHash = await this.hashPassword(createUserDto.password);
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          role: createUserDto.role,
          password: passwordHash,
        },
      });

      return successRepositoryResult(user);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            return constraintRepositoryResult();
        }
      }
      this.logger.error('[UsersRepository.create]', err);
      return fatalRepositoryResult();
    }
  }

  async findAll(
    query: UsersQueryDto,
  ): Promise<SuccessRepositoryResult<Paginated<User>> | FatalRepositoryResult> {
    try {
      const pageNumber = query.pageNumber ?? DEFAULT_PAGE_NUMBER;
      const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
      const sortBy = query.sortBy ?? 'email';
      const sortOrder = query.sortOrder ?? DEFAULT_SORT_ORDER;
      const skip = (pageNumber - 1) * pageSize;
      const take = pageSize;
      const orderBy: Prisma.UserOrderByWithRelationInput = {
        [sortBy]: sortOrder,
      };

      const where: Prisma.UserWhereInput = {
        ...(query.search && {
          OR: [{ email: { contains: query.search, mode: 'insensitive' } }],
        }),
      };

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          where,
          skip,
          take,
          orderBy,
        }),
        this.prisma.user.count({ where }),
      ]);

      const totalPages = Math.ceil(totalItems / pageSize);

      return successRepositoryResult({
        meta: {
          pageNumber,
          pageSize,
          totalItems,
          totalPages,
        },
        items,
      });
    } catch (err: unknown) {
      this.logger.error('[UsersRepository.findAll]', err);
      return fatalRepositoryResult();
    }
  }

  async findOneById(
    id: string,
  ): Promise<
    | SuccessRepositoryResult<User>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return notFoundRepositoryResult();
      }

      return successRepositoryResult(user);
    } catch (err: unknown) {
      this.logger.error('[UsersRepository.findOneById]', err);
      return fatalRepositoryResult();
    }
  }

  async findOneByEmail(
    email: string,
  ): Promise<
    | SuccessRepositoryResult<User>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return notFoundRepositoryResult();
      }

      return successRepositoryResult(user);
    } catch (err: unknown) {
      this.logger.error('[UsersRepository.findOneByEmail]', err);
      return fatalRepositoryResult();
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<
    | SuccessRepositoryResult<User>
    | ConstraintRepositoryResult
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const { password, ...rest } = updateUserDto;

      const data: Prisma.UserUpdateInput = {
        ...rest,
      };

      if (password) {
        data.password = await this.hashPassword(password);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data,
      });

      return successRepositoryResult(user);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            return constraintRepositoryResult();
          case 'P2025':
            return notFoundRepositoryResult();
        }
      }

      this.logger.error('[UsersRepository.update]', err);
      return fatalRepositoryResult();
    }
  }

  async remove(
    id: string,
  ): Promise<
    | SuccessRepositoryResult<User>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });

      return successRepositoryResult(user);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2025':
            return notFoundRepositoryResult();
        }
      }

      this.logger.error('[UsersRepository.remove]', err);
      return fatalRepositoryResult();
    }
  }
}
