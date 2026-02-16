import { Expose } from 'class-transformer';

export class AuthTokensResponseDto {
  @Expose()
  accessToken: string;
}
