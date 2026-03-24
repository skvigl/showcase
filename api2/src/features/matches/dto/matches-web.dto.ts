import { Type } from 'class-transformer';

import { ResponseCollectionDto } from 'src/shared/dto/response-collections.dto';
import { MatchWebDto } from './match-web.dto';

export class MatchesWebDto extends ResponseCollectionDto<MatchWebDto> {
  @Type(() => MatchWebDto)
  declare items: MatchWebDto[];
}
