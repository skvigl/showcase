import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';
import { EventsService } from 'src/features/events/events.service';
import { TeamsService } from 'src/features/teams/teams.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchesQueryDto } from './dto/matches-query.dto';
import {
  notFoundServiceResult,
  NotFoundServiceResult,
  successServiceResult,
  SuccessServiceResult,
} from 'src/shared/types/service-result';
import type { Match } from 'src/generated/prisma/client';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async create(createMatchDto: CreateMatchDto) {
    // const { eventId, homeTeamId, awayTeamId } = createMatchDto;

    // const event = await this.eventsService.findOne(eventId);

    // if (!event) {
    //   throw new BadRequestException(`Event with id = ${eventId} not found`);
    // }

    // if (homeTeamId) {
    //   const homeTeam = await this.teamService.findOne(homeTeamId);

    //   if (!homeTeam) {
    //     throw new BadRequestException(
    //       `Home team with id = ${homeTeamId} not found`,
    //     );
    //   }
    // }

    // if (awayTeamId) {
    //   const awayTeam = await this.teamService.findOne(awayTeamId);

    //   if (!awayTeam) {
    //     throw new BadRequestException(
    //       `Away team with id = ${awayTeamId} not found`,
    //     );
    //   }
    // }
    try {
      const match = await this.prisma.match.create({
        data: createMatchDto,
      });
    } catch (err) {
      console.log(err.meta);
      // BadRequestException
      // NotFoundException
    }
  }

  async findAll(query: MatchesQueryDto) {
    const pageNumber = query.pageNumber ?? 1;
    const pageSize = query.pageSize ?? 20;
    const sortBy = query.sortBy ?? 'date';
    const sortOrder = query.sortOrder ?? 'asc';
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;
    const orderBy = {
      [sortBy]: sortOrder,
    };

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.match.findMany({
        skip,
        take,
        orderBy,
      }),
      this.prisma.match.count({}),
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      meta: {
        pageNumber,
        pageSize,
        totalItems,
        totalPages,
      },
      items,
    };
  }

  async findOne(
    id: string,
  ): Promise<SuccessServiceResult<Match> | NotFoundServiceResult> {
    const match = await this.prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      return notFoundServiceResult('Match', id);
    }

    return successServiceResult(match);
  }

  async update(id: string, updateMatchDto: UpdateMatchDto) {
    const matchResult = await this.findOne(id);

    if (matchResult.status === 'not_found') {
      return notFoundServiceResult('Match', id);
    }

    return this.prisma.match.update({
      where: { id },
      data: updateMatchDto,
    });
  }

  async remove(id: string) {
    const matchResult = await this.findOne(id);

    if (matchResult.status === 'not_found') {
      return notFoundServiceResult('Match', id);
    }

    // repo

    return this.prisma.match.delete({
      where: { id },
    });
  }
}
