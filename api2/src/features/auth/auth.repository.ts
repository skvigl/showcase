import { Injectable, Logger } from '@nestjs/common';
import { Prisma, RefreshToken } from 'src/generated/prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import {
  successRepositoryResult,
  fatalRepositoryResult,
  notFoundRepositoryResult,
  constraintRepositoryResult,
  SuccessRepositoryResult,
  NotFoundRepositoryResult,
  FatalRepositoryResult,
  ConstraintRepositoryResult,
} from 'src/shared/types/repository-result';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByToken(
    token: string,
  ): Promise<
    | SuccessRepositoryResult<RefreshToken>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const refreshToken = await this.prisma.refreshToken.findUnique({
        where: { token },
      });

      if (!refreshToken) {
        return notFoundRepositoryResult();
      }

      return successRepositoryResult(refreshToken);
    } catch (err: unknown) {
      this.logger.error('[AuthRepository.findByToken]', err);
      return fatalRepositoryResult();
    }
  }

  async create(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<
    | SuccessRepositoryResult<RefreshToken>
    | ConstraintRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const refreshToken = await this.prisma.refreshToken.create({ data });
      return successRepositoryResult(refreshToken);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2003':
            return constraintRepositoryResult();
        }
      }
      this.logger.error('[AuthRepository.create]', err);
      return fatalRepositoryResult();
    }
  }

  async update(params: {
    oldToken: string;
    newToken: string;
    expiresAt: Date;
  }): Promise<
    | SuccessRepositoryResult<RefreshToken>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const refreshToken = await this.prisma.refreshToken.update({
        where: { token: params.oldToken },
        data: {
          token: params.newToken,
          expiresAt: params.expiresAt,
        },
      });

      return successRepositoryResult(refreshToken);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2025':
            return notFoundRepositoryResult();
        }
      }
      this.logger.error('[AuthRepository.update]', err);
      return fatalRepositoryResult();
    }
  }

  async remove(
    token: string,
  ): Promise<
    | SuccessRepositoryResult<null>
    | NotFoundRepositoryResult
    | FatalRepositoryResult
  > {
    try {
      const refreshToken = await this.prisma.refreshToken.deleteMany({
        where: { token },
      });

      if (refreshToken.count === 0) {
        return notFoundRepositoryResult();
      }

      return successRepositoryResult(null);
    } catch (err: unknown) {
      this.logger.error('[AuthRepository.remove]', err);
      return fatalRepositoryResult();
    }
  }
}
