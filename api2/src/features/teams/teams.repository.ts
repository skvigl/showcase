import { Injectable, Logger } from '@nestjs/common';

import { Team, Prisma } from 'src/generated/prisma/client';
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
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsQueryDto } from './dto/teams-query.dto';
import { Paginated } from 'src/shared/types/paginations';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_ORDER,
} from 'src/shared/constants/pagination';

@Injectable()
export class TeamsRepository {
  private readonly logger = new Logger(TeamsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createTeamDto: CreateTeamDto,
  ): Promise<
    | SuccessRepositoryResult<Team>
    | ConstraintRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const team = await this.prisma.team.create({
        data: createTeamDto,
      });

      return successRepositoryResult(team);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2003':
            return constraintRepositoryResult();
        }
      }
      this.logger.error('Repository error: ', err);
      return fatalRepositoryResult();
    }
  }

  async findAll(
    query: TeamsQueryDto,
  ): Promise<SuccessRepositoryResult<Paginated<Team>> | FatalRepositoryResult> {
    try {
      const pageNumber = query.pageNumber ?? DEFAULT_PAGE_NUMBER;
      const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
      const sortBy = query.sortBy ?? 'name';
      const sortOrder = query.sortOrder ?? DEFAULT_SORT_ORDER;
      const skip = (pageNumber - 1) * pageSize;
      const take = pageSize;
      const orderBy = {
        [sortBy]: sortOrder,
      };

      const where: Prisma.TeamWhereInput = {
        ...(query.search && {
          OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
        }),
      };

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.team.findMany({
          where,
          skip,
          take,
          orderBy,
        }),
        this.prisma.team.count({ where }),
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
      this.logger.error('Repository error: ', err);
      return fatalRepositoryResult();
    }
  }

  async findOne(
    id: string,
  ): Promise<
    | SuccessRepositoryResult<Team>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const team = await this.prisma.team.findUnique({
        where: { id },
      });

      if (!team) {
        return notFoundRepositoryResult();
      }

      return successRepositoryResult(team);
    } catch (err: unknown) {
      this.logger.error('Repository error: ', err);
      return fatalRepositoryResult();
    }
  }

  async update(
    id: string,
    updateTeamDto: UpdateTeamDto,
  ): Promise<
    | SuccessRepositoryResult<Team>
    | ConstraintRepositoryResult
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const team = await this.prisma.team.update({
        where: { id },
        data: updateTeamDto,
      });

      return successRepositoryResult(team);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2003':
            return constraintRepositoryResult();
          case 'P2025':
            return notFoundRepositoryResult();
        }
      }

      this.logger.error('Repository error: ', err);
      return fatalRepositoryResult();
    }
  }

  async remove(
    id: string,
  ): Promise<
    | SuccessRepositoryResult<Team>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const team = await this.prisma.team.delete({
        where: { id },
      });

      return successRepositoryResult(team);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2025':
            return notFoundRepositoryResult();
        }
      }

      this.logger.error('Repository error: ', err);
      return fatalRepositoryResult();
    }
  }
}
