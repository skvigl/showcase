import { prisma } from "../../db/prismaClient.js";

export class AuthRepository {
  async findByToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async create(data: { token: string; userId: number; expiresAt: Date }) {
    return prisma.refreshToken.create({ data });
  }

  async update(params: { oldToken: string; newToken: string; expiresAt: Date }) {
    await prisma.refreshToken.update({
      where: { token: params.oldToken },
      data: {
        token: params.newToken,
        expiresAt: params.expiresAt,
      },
    });
  }

  async delete(token: string) {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  }
}

export const authRepository = new AuthRepository();
