import { Injectable, Logger } from '@nestjs/common';
import { MatchAction, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  ConstraintRepositoryResult,
  FatalRepositoryResult,
  NotFoundRepositoryResult,
  SuccessRepositoryResult,
  constraintRepositoryResult,
  fatalRepositoryResult,
  notFoundRepositoryResult,
  successRepositoryResult,
} from 'src/shared/types/repository-result';
import { CreateMatchActionDto } from './dto/create-match-action.dto';
import { MatchActionsQueryDto } from './dto/match-actions-query.dto';
import { Paginated } from 'src/shared/types/paginations';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_ORDER,
} from 'src/shared/constants/pagination';

@Injectable()
export class MatchActionsRepository {
  private readonly logger = new Logger(MatchActionsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createMatchActionDto: CreateMatchActionDto,
  ): Promise<
    | SuccessRepositoryResult<MatchAction>
    | ConstraintRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const matchAction = await this.prisma.matchAction.create({
        data: createMatchActionDto,
      });

      return successRepositoryResult(matchAction);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2003':
            return constraintRepositoryResult();
        }
      }

      this.logger.error('[MatchActionsRepository.create]', err);
      return fatalRepositoryResult();
    }
  }

  async findAll(
    query: MatchActionsQueryDto,
  ): Promise<
    SuccessRepositoryResult<Paginated<MatchAction>> | FatalRepositoryResult
  > {
    try {
      const pageNumber = query.pageNumber ?? DEFAULT_PAGE_NUMBER;
      const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
      const sortBy = query.sortBy ?? 'tick';
      const sortOrder = query.sortOrder ?? DEFAULT_SORT_ORDER;
      const skip = (pageNumber - 1) * pageSize;
      const take = pageSize;

      const orderBy: Prisma.MatchActionOrderByWithRelationInput = {
        [sortBy]: sortOrder,
      };
      const where: Prisma.MatchActionWhereInput = {
        ...(query.matchId && { matchId: query.matchId }),
        ...(query.actorId && { actorId: query.actorId }),
        ...(query.targetId && { targetId: query.targetId }),
        ...(query.type && { type: query.type }),
      };

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.matchAction.findMany({
          where,
          skip,
          take,
          orderBy,
        }),
        this.prisma.matchAction.count({ where }),
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
      this.logger.error('[MatchActionsRepository.findAll]', err);
      return fatalRepositoryResult();
    }
  }

  async findOne(
    id: string,
  ): Promise<
    | SuccessRepositoryResult<MatchAction>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const matchAction = await this.prisma.matchAction.findUnique({
        where: { id },
      });

      if (!matchAction) {
        return notFoundRepositoryResult();
      }

      return successRepositoryResult(matchAction);
    } catch (err: unknown) {
      this.logger.error('[MatchActionsRepository.findOne]', err);
      return fatalRepositoryResult();
    }
  }
}
