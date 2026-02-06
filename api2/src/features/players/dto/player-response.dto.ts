import { Expose } from 'class-transformer';

export class PlayerResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  power: number;

  @Expose()
  teamId: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
