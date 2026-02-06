import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsQueryDto } from './dto/events-query.dto';
import { handleServiceResult } from 'src/shared/helpers/handle-service-results';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    const result = await this.eventsService.create(createEventDto);

    return handleServiceResult(result);
  }

  @Get()
  async findAll(@Query() query: EventsQueryDto) {
    const result = await this.eventsService.findAll(query);

    return handleServiceResult(result);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    const result = await this.eventsService.findOneById(id);

    return handleServiceResult(result);
  }

  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const result = await this.eventsService.update(id, updateEventDto);

    handleServiceResult(result);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const result = await this.eventsService.remove(id);

    handleServiceResult(result);
  }
}
