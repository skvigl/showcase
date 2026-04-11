import { UserRole } from '@app/types/user';

export interface AuthUser {
  sub: number;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
