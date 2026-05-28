import { Type } from 'class-transformer';

import { ResponseCollectionDto } from 'src/shared/dto/response-collections.dto';
import { UserWebDto } from './user.web.dto';

export class UsersWebDto extends ResponseCollectionDto<UserWebDto> {
  @Type(() => UserWebDto)
  declare items: UserWebDto[];
}
