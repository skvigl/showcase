import { Type } from 'class-transformer';

import { ResponseCollectionDto } from 'src/shared/dto/response-collections.dto';
import { EventResponseDto } from './event-response.dto';

export class EventsResponseDto extends ResponseCollectionDto<EventResponseDto> {
  @Type(() => EventResponseDto)
  declare items: EventResponseDto[];
}
