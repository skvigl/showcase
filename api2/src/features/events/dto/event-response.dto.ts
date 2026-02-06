import { Expose } from 'class-transformer';

export class EventResponseDto {
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
