import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsQueryDto } from './dto/events-query.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: createEventDto,
    });
  }

  async findAll(query: EventsQueryDto) {
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
      this.prisma.event.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.prisma.event.count({ where }),
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
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    await this.findOne(id);

    return this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.event.delete({
      where: { id },
    });
  }
}
