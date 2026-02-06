import { ResponseCollectionDto } from 'src/shared/dto/response-collections.dto';
import { TeamResponseDto } from './team-response.dto';
import { Type } from 'class-transformer';

export class TeamsResponseDto extends ResponseCollectionDto<TeamResponseDto> {
  @Type(() => TeamResponseDto)
  declare items: TeamResponseDto[];
}
