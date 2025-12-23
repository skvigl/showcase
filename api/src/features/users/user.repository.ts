import bcrypt from "bcryptjs";
import { prisma } from "../../db/prismaClient.js";
import { toUserCredentials, toUserDto, toUserDtos } from "./user.mapper.js";
import type { User, UserCredentials } from "../../types/user.js";
import type { UserCreateDto, UserParamsDto, UserUpdateDto } from "./user.schema.js";

class UserRepository {
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "asc" } });

    return toUserDtos(users);
  }

  async findById(id: UserParamsDto["id"]): Promise<User | null> {
    const user = await prisma.user.findFirst({ where: { id, deletedAt: null } });

    if (!user) return null;

    return toUserDto(user);
  }

  async findByEmail(email: string): Promise<UserCredentials | null> {
    const user = await prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (!user) return null;

    return toUserCredentials(user);
  }

  async create(dto: UserCreateDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    return toUserDto(user);
  }

  async update(id: UserParamsDto["id"], dto: UserUpdateDto): Promise<User | null> {
    const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } });

    if (!existing) return null;

    const user = await prisma.user.update({ where: { id }, data: dto });

    return toUserDto(user);
  }

  async delete(id: UserParamsDto["id"]): Promise<UserParamsDto["id"] | null> {
    const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } });

    if (!existing) return null;

    await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });

    return id;
  }
}
export const userRepository = new UserRepository();
