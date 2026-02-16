import { Injectable } from '@nestjs/common';

import {
  FatalServiceResult,
  fatalServiceResult,
  NotFoundServiceResult,
  SuccessServiceResult,
  successServiceResult,
  notFoundServiceResult,
  FailedServiceResult,
  failedServiceResult,
} from 'src/shared/types/service-result';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsQueryDto } from './dto/events-query.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { EventsRepository } from './events.repository';
import { mapToPublicDto, mapToPaginatedDto } from 'src/shared/helpers/mapper';
import { EventsResponseDto } from './dto/events-response.dto';

@Injectable()
export class EventsService {
  constructor(private eventsRepository: EventsRepository) {}

  async create(
    createEventDto: CreateEventDto,
  ): Promise<
    | SuccessServiceResult<EventResponseDto>
    | FailedServiceResult
    | FatalServiceResult
  > {
    const result = await this.eventsRepository.create(createEventDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(
          mapToPublicDto(EventResponseDto, result.data),
        );
      case 'constraint':
        return failedServiceResult();
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findAll(
    query: EventsQueryDto,
  ): Promise<SuccessServiceResult<EventsResponseDto> | FatalServiceResult> {
    const result = await this.eventsRepository.findAll(query);

    switch (result.status) {
      case 'success': {
        return successServiceResult(
          mapToPaginatedDto(EventResponseDto, result.data),
        );
      }
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async findOneById(
    id: string,
  ): Promise<
    | SuccessServiceResult<EventResponseDto>
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.eventsRepository.findOne(id);

    switch (result.status) {
      case 'success': {
        return successServiceResult(
          mapToPublicDto(EventResponseDto, result.data),
        );
      }
      case 'not_found':
        return notFoundServiceResult('Event', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<
    | SuccessServiceResult<null>
    | FailedServiceResult
    | NotFoundServiceResult
    | FatalServiceResult
  > {
    const result = await this.eventsRepository.update(id, updateEventDto);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'constraint':
        return failedServiceResult();
      case 'not_found':
        return notFoundServiceResult('Event', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }

  async remove(
    id: string,
  ): Promise<
    SuccessServiceResult<null> | NotFoundServiceResult | FatalServiceResult
  > {
    const result = await this.eventsRepository.remove(id);

    switch (result.status) {
      case 'success':
        return successServiceResult(null);
      case 'not_found':
        return notFoundServiceResult('Event', id);
      case 'fatal':
      default:
        return fatalServiceResult();
    }
  }
}
