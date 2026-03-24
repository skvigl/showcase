import { ResponseCollectionDto } from 'src/shared/dto/response-collections.dto';
import { PlayerWebDto } from './player-web.dto';
import { Type } from 'class-transformer';

export class PlayersWebDto extends ResponseCollectionDto<PlayerWebDto> {
  @Type(() => PlayerWebDto)
  declare items: PlayerWebDto[];
}
