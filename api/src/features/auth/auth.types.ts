import { Email, UserRoles } from "../users/user.schema.js";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayload = {
  sub: number;
  email: Email;
  role: UserRoles;
};

export type RefreshToken = {
  token: string;
  userId: number;
  expiresAt: Date;
};
