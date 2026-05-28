import { Expose } from 'class-transformer';

export class UserWebDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
