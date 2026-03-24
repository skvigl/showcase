import { Type } from 'class-transformer';

import { ResponseCollectionDto } from 'src/shared/dto/response-collections.dto';
import { EventWebDto } from './event-web.dto';

export class EventsWebDto extends ResponseCollectionDto<EventWebDto> {
  @Type(() => EventWebDto)
  declare items: EventWebDto[];
}
