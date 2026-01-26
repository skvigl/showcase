import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayersQueryDto } from './dto/players-query.dto';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class PlayersService {
  constructor(
    private prisma: PrismaService,
    private teamService: TeamsService,
  ) {}

  async create(createPlayerDto: CreatePlayerDto) {
    const { teamId } = createPlayerDto;

    if (teamId) {
      const team = await this.teamService.findOne(teamId);

      if (!team) {
        throw new BadRequestException(`Team with id ${teamId} not found`);
      }
    }

    return this.prisma.player.create({
      data: createPlayerDto,
    });
  }

  async findAll(query: PlayersQueryDto) {
    const pageNumber = query.pageNumber ?? 1;
    const pageSize = query.pageSize ?? 20;
    const sortBy = query.sortBy ?? 'firstName';
    const sortOrder = query.sortOrder ?? 'asc';
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;
    const orderBy = {
      [sortBy]: sortOrder,
    };

    let where = {};

    if (query.search) {
      where = {
        OR: [
          { firstName: { contains: query.search, mode: 'insensitive' } },
          { lastName: { contains: query.search, mode: 'insensitive' } },
        ],
      };
    }

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

  async findOne(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }

    return player;
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto) {
    await this.findOne(id);

    return this.prisma.player.update({
      where: { id },
      data: updatePlayerDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.player.delete({
      where: { id },
    });
  }
}
