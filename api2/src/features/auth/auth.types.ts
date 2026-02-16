export enum Role {
  Admin = 'admin',
  Creator = 'creator',
  User = 'user',
}

export interface AuthenticatedUser {
  userId: string;
  role: Role;
}

export interface JwtPayload {
  sub: string;
  role: Role;
}
