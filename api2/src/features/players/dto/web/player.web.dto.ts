import { Expose } from 'class-transformer';

export class PlayerWebDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  attack: number;

  @Expose()
  defence: number;

  @Expose()
  teamId: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
