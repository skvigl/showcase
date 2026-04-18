import { Injectable, Logger } from '@nestjs/common';

import { Match, MatchStatus, Prisma } from 'src/generated/prisma/client';
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
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchesQueryDto } from './dto/matches-query.dto';
import { Paginated } from 'src/shared/types/paginations';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_ORDER,
} from 'src/shared/constants/pagination';
import { MatchQueryDto } from './dto/match-query.dto';

@Injectable()
export class MatchesRepository {
  private readonly logger = new Logger(MatchesRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  private buildPrismaInclude(
    query: MatchQueryDto,
  ): Prisma.MatchInclude | undefined {
    if (!query.include?.length) return;

    const includeObj: Prisma.MatchInclude = {
      tournament: query.include.includes('tournament'),
      homeTeam: query.include.includes('homeTeam'),
      awayTeam: query.include.includes('awayTeam'),
    };

    return Object.values(includeObj).some(Boolean) ? includeObj : undefined;
  }

  async create(
    createMatchDto: CreateMatchDto,
  ): Promise<
    | SuccessRepositoryResult<Match>
    | ConstraintRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const match = await this.prisma.match.create({
        data: createMatchDto,
      });

      return successRepositoryResult(match);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2003':
            return constraintRepositoryResult();
        }
      }

      this.logger.error('[MatchesRepository.create]', err);
      return fatalRepositoryResult();
    }
  }

  async findAll(
    query: MatchesQueryDto,
  ): Promise<
    SuccessRepositoryResult<Paginated<Match>> | FatalRepositoryResult
  > {
    try {
      const pageNumber = query.pageNumber ?? DEFAULT_PAGE_NUMBER;
      const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
      const sortBy = query.sortBy ?? 'date';
      const sortOrder = query.sortOrder ?? DEFAULT_SORT_ORDER;
      const skip = (pageNumber - 1) * pageSize;
      const take = pageSize;
      const orderBy: Prisma.MatchOrderByWithRelationInput = {
        [sortBy]: sortOrder,
      };

      const where = {
        ...(query.tournamentId && { tournamentId: query.tournamentId }),
      };

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.match.findMany({
          where,
          skip,
          take,
          orderBy,
        }),
        this.prisma.match.count({ where }),
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
      this.logger.error('[MatchesRepository.findAll]', err);
      return fatalRepositoryResult();
    }
  }

  async findOne(
    id: string,
    query: MatchQueryDto,
  ): Promise<
    | SuccessRepositoryResult<Match>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const include = this.buildPrismaInclude(query);
      const match = await this.prisma.match.findUnique({
        where: { id },
        include,
      });

      if (!match) {
        return notFoundRepositoryResult();
      }

      return successRepositoryResult(match);
    } catch (err: unknown) {
      this.logger.error('[MatchesRepository.findOne]', err);
      return fatalRepositoryResult();
    }
  }

  async update(
    id: string,
    updateMatchDto: UpdateMatchDto,
  ): Promise<
    | SuccessRepositoryResult<Match>
    | ConstraintRepositoryResult
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const match = await this.prisma.match.update({
        where: { id },
        data: updateMatchDto,
      });

      return successRepositoryResult(match);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2003':
            return constraintRepositoryResult();
          case 'P2025':
            return notFoundRepositoryResult();
        }
      }

      this.logger.error('[MatchesRepository.update]', err);
      return fatalRepositoryResult();
    }
  }

  async remove(
    id: string,
  ): Promise<
    | SuccessRepositoryResult<Match>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const match = await this.prisma.match.delete({
        where: { id },
      });

      return successRepositoryResult(match);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2025':
            return notFoundRepositoryResult();
        }
      }

      this.logger.error('[MatchesRepository.remove]', err);
      return fatalRepositoryResult();
    }
  }

  async findLastByTeam(
    tournamentId: string,
    teamId: string,
    limit: number,
  ): Promise<SuccessRepositoryResult<Match[]> | FatalRepositoryResult> {
    try {
      const matches = await this.prisma.match.findMany({
        where: {
          tournamentId,
          status: 'finished',
          OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
        },
        orderBy: {
          date: 'desc',
        },
        take: limit,
      });

      return successRepositoryResult(matches);
    } catch (err: unknown) {
      this.logger.error('[MatchesRepository.findLastByTeam]', err);
      return fatalRepositoryResult();
    }
  }

  async findByFilters(filters: {
    tournamentId?: string;
    teamId?: string;
    statuses?: MatchStatus[];
    limit?: number;
    order?: 'asc' | 'desc';
  }): Promise<SuccessRepositoryResult<Match[]> | FatalRepositoryResult> {
    try {
      const matches = await this.prisma.match.findMany({
        where: {
          ...(filters.tournamentId && { tournamentId: filters.tournamentId }),
          ...(filters.statuses && { status: { in: filters.statuses } }),
          ...(filters.teamId && {
            OR: [
              { homeTeamId: filters.teamId },
              { awayTeamId: filters.teamId },
            ],
          }),
        },
        orderBy: { date: filters.order || 'desc' },
        take: filters.limit,
      });

      return successRepositoryResult(matches);
    } catch (err: unknown) {
      this.logger.error('[MatchesRepository.findByFilters]', err);
      return fatalRepositoryResult();
    }
  }
}
