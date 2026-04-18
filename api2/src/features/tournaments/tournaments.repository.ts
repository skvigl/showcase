import { Injectable, Logger } from '@nestjs/common';

import { Tournament, Match, Prisma } from 'src/generated/prisma/client';
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
import { CreateTournamentInput } from './types/create-tournament-input';
import { UpdateTournamentInput } from './types/update-tournament-input';
import { TournamentsQueryInput } from './types/tournaments-query-input';

interface TournamentWithMatches extends Tournament {
  matches: Match[];
}

@Injectable()
export class TournamentsRepository {
  private readonly logger = new Logger(TournamentsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  private async findOneInternal<T>(
    id: string,
    include?: Prisma.TournamentInclude,
  ): Promise<
    | SuccessRepositoryResult<T>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const tournament = await this.prisma.tournament.findUnique({
        where: { id },
        include,
      });

      if (!tournament) return notFoundRepositoryResult();

      return successRepositoryResult(tournament as T);
    } catch (err: unknown) {
      this.logger.error('[TournamentsRepository.findOneInternal]', err);
      return fatalRepositoryResult();
    }
  }

  async create(
    createTournamentInput: CreateTournamentInput,
  ): Promise<
    | SuccessRepositoryResult<Tournament>
    | ConstraintRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const tournament = await this.prisma.tournament.create({
        data: createTournamentInput,
      });

      return successRepositoryResult(tournament);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2003':
            return constraintRepositoryResult();
        }
      }
      this.logger.error('[TournamentsRepository.create]', err);
      return fatalRepositoryResult();
    }
  }

  async findAll(
    query: TournamentsQueryInput,
  ): Promise<
    SuccessRepositoryResult<Paginated<Tournament>> | FatalRepositoryResult
  > {
    try {
      const pageNumber = query.pageNumber ?? DEFAULT_PAGE_NUMBER;
      const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
      const sortBy = query.sortBy ?? 'startDate';
      const sortOrder = query.sortOrder ?? DEFAULT_SORT_ORDER;
      const skip = (pageNumber - 1) * pageSize;
      const take = pageSize;
      const orderBy = {
        [sortBy]: sortOrder,
      };

      const where: Prisma.TournamentWhereInput = {
        ...(query.search && {
          OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
        }),
      };

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.tournament.findMany({
          where,
          skip,
          take,
          orderBy,
        }),
        this.prisma.tournament.count({ where }),
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
      this.logger.error('[TournamentsRepository.findAll]', err);
      return fatalRepositoryResult();
    }
  }

  async findOne(
    id: string,
  ): Promise<
    | SuccessRepositoryResult<Tournament>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    return this.findOneInternal<Tournament>(id);
  }

  async update(
    id: string,
    updateTournamentInput: UpdateTournamentInput,
  ): Promise<
    | SuccessRepositoryResult<Tournament>
    | ConstraintRepositoryResult
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const tournament = await this.prisma.tournament.update({
        where: { id },
        data: updateTournamentInput,
      });

      return successRepositoryResult(tournament);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2003':
            return constraintRepositoryResult();
          case 'P2025':
            return notFoundRepositoryResult();
        }
      }

      this.logger.error('[TournamentsRepository.update]', err);
      return fatalRepositoryResult();
    }
  }

  async remove(
    id: string,
  ): Promise<
    | SuccessRepositoryResult<Tournament>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const tournament = await this.prisma.tournament.delete({
        where: { id },
      });

      return successRepositoryResult(tournament);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2025':
            return notFoundRepositoryResult();
        }
      }

      this.logger.error('[TournamentsRepository.remove]', err);
      return fatalRepositoryResult();
    }
  }

  async findOneWithMatches(
    id: string,
  ): Promise<
    | SuccessRepositoryResult<TournamentWithMatches>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    return this.findOneInternal<TournamentWithMatches>(id, {
      matches: {
        orderBy: {
          date: 'asc',
        },
      },
    });
  }
}
