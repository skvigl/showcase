import { prisma } from "../../db/prismaClient.js";
import type { User, UserCredentials } from "../../types/user.js";

type PrismaUser = NonNullable<Awaited<ReturnType<typeof prisma.user.findFirst>>>;

export function toUserDto(user: PrismaUser): User {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function toUserDtos(users: PrismaUser[]): User[] {
  return users.map(toUserDto);
}

export function toUserCredentials(entity: PrismaUser): UserCredentials {
  return {
    id: entity.id,
    email: entity.email,
    role: entity.role,
    passwordHash: entity.password,
  };
}
