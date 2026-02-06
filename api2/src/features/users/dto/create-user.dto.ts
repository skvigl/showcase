import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export const USER_ROLES = ['user', 'admin', 'creator'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export class CreateUserDto {
  @IsEmail()
  @MaxLength(64)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(USER_ROLES)
  role: UserRole;
}
