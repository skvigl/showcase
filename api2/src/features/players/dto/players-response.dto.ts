import { ResponseCollectionDto } from 'src/shared/dto/response-collections.dto';
import { PlayerResponseDto } from './player-response.dto';
import { Type } from 'class-transformer';

export class PlayersResponseDto extends ResponseCollectionDto<PlayerResponseDto> {
  @Type(() => PlayerResponseDto)
  declare items: PlayerResponseDto[];
}
