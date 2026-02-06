import { Injectable, Logger } from '@nestjs/common';

import { Event, Prisma } from 'src/generated/prisma/client';
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
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsQueryDto } from './dto/events-query.dto';
import { Paginated } from 'src/shared/types/paginations';
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_ORDER,
} from 'src/shared/constants/pagination';

@Injectable()
export class EventsRepository {
  private readonly logger = new Logger(EventsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createEventDto: CreateEventDto,
  ): Promise<
    | SuccessRepositoryResult<Event>
    | ConstraintRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const event = await this.prisma.event.create({
        data: createEventDto,
      });

      return successRepositoryResult(event);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2003':
            return constraintRepositoryResult();
        }
      }
      this.logger.error('[EventsRepository.update]', err);
      return fatalRepositoryResult();
    }
  }

  async findAll(
    query: EventsQueryDto,
  ): Promise<
    SuccessRepositoryResult<Paginated<Event>> | FatalRepositoryResult
  > {
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

      const where: Prisma.EventWhereInput = {
        ...(query.search && {
          OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
        }),
      };

      const [items, totalItems] = await this.prisma.$transaction([
        this.prisma.event.findMany({
          where,
          skip,
          take,
          orderBy,
        }),
        this.prisma.event.count({ where }),
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
    | SuccessRepositoryResult<Event>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const event = await this.prisma.event.findUnique({
        where: { id },
      });

      if (!event) {
        return notFoundRepositoryResult();
      }

      return successRepositoryResult(event);
    } catch (err: unknown) {
      this.logger.error('Repository error: ', err);
      return fatalRepositoryResult();
    }
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<
    | SuccessRepositoryResult<Event>
    | ConstraintRepositoryResult
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const event = await this.prisma.event.update({
        where: { id },
        data: updateEventDto,
      });

      return successRepositoryResult(event);
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
    | SuccessRepositoryResult<Event>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const event = await this.prisma.event.delete({
        where: { id },
      });

      return successRepositoryResult(event);
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
