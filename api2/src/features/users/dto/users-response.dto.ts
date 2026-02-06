import { Type } from 'class-transformer';

import { ResponseCollectionDto } from 'src/shared/dto/response-collections.dto';
import { UserResponseDto } from './user-response.dto';

export class UsersResponseDto extends ResponseCollectionDto<UserResponseDto> {
  @Type(() => UserResponseDto)
  declare items: UserResponseDto[];
}
