import { Type } from 'class-transformer';

import { ResponseCollectionDto } from 'src/shared/dto/response-collections.dto';
import { MatchResponseDto } from './match-response.dto';

export class MatchesResponseDto extends ResponseCollectionDto<MatchResponseDto> {
  @Type(() => MatchResponseDto)
  declare items: MatchResponseDto[];
}
