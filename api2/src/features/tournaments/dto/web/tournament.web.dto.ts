import { Expose } from 'class-transformer';

export class TournamentWebDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
