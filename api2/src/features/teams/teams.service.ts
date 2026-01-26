import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamsQueryDto } from './dto/teams-query.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  create(createTeamDto: CreateTeamDto) {
    return this.prisma.team.create({
      data: createTeamDto,
    });
  }

  async findAll(query: TeamsQueryDto) {
    const pageNumber = query.pageNumber ?? 1;
    const pageSize = query.pageSize ?? 20;
    const sortBy = query.sortBy ?? 'name';
    const sortOrder = query.sortOrder ?? 'asc';
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;
    const orderBy = {
      [sortBy]: sortOrder,
    };

    let where = {};

    if (query.search) {
      where = {
        OR: [{ name: { contains: query.search, mode: 'insensitive' } }],
      };
    }

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
    const team = await this.prisma.team.findUnique({
      where: { id },
    });

    if (!team) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    await this.findOne(id);

    return this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.team.delete({
      where: { id },
    });
  }
}
