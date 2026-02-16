import { Injectable, Logger } from '@nestjs/common';

import { Player, Prisma } from 'src/generated/prisma/client';
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
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersQueryDto } from './dto/players-query.dto';
import { Paginated } from 'src/shared/types/paginations';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_ORDER,
} from 'src/shared/constants/pagination';

@Injectable()
export class PlayersRepository {
  private readonly logger = new Logger(PlayersRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createPlayerDto: CreatePlayerDto,
  ): Promise<
    | SuccessRepositoryResult<Player>
    | ConstraintRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const player = await this.prisma.player.create({
        data: createPlayerDto,
      });

      return successRepositoryResult(player);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2003':
            return constraintRepositoryResult();
        }
      }
      this.logger.error('[PlayersRepository.create]', err);
      return fatalRepositoryResult();
    }
  }

  async findAll(
    query: PlayersQueryDto,
  ): Promise<
    SuccessRepositoryResult<Paginated<Player>> | FatalRepositoryResult
  > {
    try {
      const pageNumber = query.pageNumber ?? DEFAULT_PAGE_NUMBER;
      const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
      const sortBy = query.sortBy ?? 'firstName';
      const sortOrder = query.sortOrder ?? DEFAULT_SORT_ORDER;
      const skip = (pageNumber - 1) * pageSize;
      const take = pageSize;
      const orderBy = {
        [sortBy]: sortOrder,
      };

      const where: Prisma.PlayerWhereInput = {
        ...(query.search && {
          OR: [
            { firstName: { contains: query.search, mode: 'insensitive' } },
            { lastName: { contains: query.search, mode: 'insensitive' } },
          ],
        }),
      };

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.player.findMany({
          where,
          skip,
          take,
          orderBy,
        }),
        this.prisma.player.count({ where }),
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
      this.logger.error('[PlayersRepository.findAll]', err);
      return fatalRepositoryResult();
    }
  }

  async findOne(
    id: string,
  ): Promise<
    | SuccessRepositoryResult<Player>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const player = await this.prisma.player.findUnique({
        where: { id },
      });

      if (!player) {
        return notFoundRepositoryResult();
      }

      return successRepositoryResult(player);
    } catch (err: unknown) {
      this.logger.error('[PlayersRepository.findOne]', err);
      return fatalRepositoryResult();
    }
  }

  async update(
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<
    | SuccessRepositoryResult<Player>
    | ConstraintRepositoryResult
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const player = await this.prisma.player.update({
        where: { id },
        data: updatePlayerDto,
      });

      return successRepositoryResult(player);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2003':
            return constraintRepositoryResult();
          case 'P2025':
            return notFoundRepositoryResult();
        }
      }

      this.logger.error('[PlayersRepository.update]', err);
      return fatalRepositoryResult();
    }
  }

  async remove(
    id: string,
  ): Promise<
    | SuccessRepositoryResult<Player>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const player = await this.prisma.player.delete({
        where: { id },
      });

      return successRepositoryResult(player);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2025':
            return notFoundRepositoryResult();
        }
      }

      this.logger.error('[PlayersRepository.remove]', err);
      return fatalRepositoryResult();
    }
  }
}
