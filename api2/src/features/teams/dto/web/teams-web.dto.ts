import { ResponseCollectionDto } from 'src/shared/dto/response-collections.dto';
import { TeamWebDto } from './team-web.dto';
import { Type } from 'class-transformer';

export class TeamsWebDto extends ResponseCollectionDto<TeamWebDto> {
  @Type(() => TeamWebDto)
  declare items: TeamWebDto[];
}
