import { failedResult, handleServiceError, notFoundResult, successResult } from "../../utils/serviceResult.js";
import { userRepository } from "./user.repository.js";
import { ICacheProvider, createCacheProvider } from "../../cache.provider.js";
import type { ServiceResult } from "../../utils/serviceResult.js";
import type { UserCreateDto, UserParamsDto, UserUpdateDto } from "./user.schema.js";
import type { User, UserCredentials } from "../../types/user.js";

export class UserService {
  constructor(private cache: ICacheProvider) {
    this.cache = cache;
  }

  async getAll(): Promise<ServiceResult<User[]>> {
    return handleServiceError(async () => {
      const key = `users:list`;
      const cached = await this.cache.get<User[]>(key);

      if (cached) {
        return successResult(cached);
      }

      const users = await userRepository.findAll();

      await this.cache.set(key, users, 60);

      return successResult(users);
    }, "UserService.getAll");
  }

  async getById(id: UserParamsDto["id"]): Promise<ServiceResult<User>> {
    return handleServiceError(async () => {
      const key = `users:${id}`;
      const cached = await this.cache.get<User>(key);

      if (cached) {
        return successResult(cached);
      }

      const user = await userRepository.findById(id);

      if (!user) {
        return notFoundResult("User", id);
      }

      await this.cache.set(key, user, 60);

      return successResult(user);
    }, "UserService.getById");
  }

  async getByEmail(email: string): Promise<ServiceResult<UserCredentials>> {
    return handleServiceError(async () => {
      const user = await userRepository.findByEmail(email);

      if (!user) {
        return failedResult("User not found");
      }

      return successResult(user);
    }, "UserService.getByEmail");
  }

  async create(dto: UserCreateDto): Promise<ServiceResult<User>> {
    return handleServiceError(async () => {
      const user = await userRepository.create(dto);

      if (!user) {
        return failedResult("Cannot create user");
      }

      return successResult(user);
    }, "UserService.create");
  }

  async update(id: UserParamsDto["id"], dto: UserUpdateDto): Promise<ServiceResult<null>> {
    return handleServiceError(async () => {
      const user = await userRepository.update(id, dto);

      if (!user) {
        return notFoundResult("User", id);
      }

      await this.cache.del([`users:${id}`]);

      return successResult(null);
    }, "UserService.update");
  }

  async delete(id: UserParamsDto["id"]): Promise<ServiceResult<null>> {
    return handleServiceError(async () => {
      const result = await userRepository.delete(id);

      if (!result) {
        return notFoundResult("User", id);
      }

      await this.cache.del([`users:${id}`]);

      return successResult(null);
    }, "UserService.delete");
  }
}

export const userService = new UserService(createCacheProvider());
