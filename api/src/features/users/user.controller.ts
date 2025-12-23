import { FastifyRequest, FastifyReply } from "fastify";

import { userService } from "./user.service.js";
import { UserCreateDto, UserParamsDto, UserUpdateDto } from "./user.schema.js";
import { badRequestError, notFoundError } from "../../utils/httpResponses.js";

export class UserController {
  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    const result = await userService.getAll();

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
    }
  }

  async getUserById(request: FastifyRequest<{ Params: UserParamsDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await userService.getById(id);

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
    }
  }

  async createUser(request: FastifyRequest<{ Body: UserCreateDto }>, reply: FastifyReply) {
    const { email, password, role } = request.body;
    const result = await userService.create({ email, password, role });

    switch (result.status) {
      case "success":
        return reply.status(201).send(result.data);
      case "failed":
        return reply.status(400).send(badRequestError(result.message));
    }
  }

  async updateUser(request: FastifyRequest<{ Params: UserParamsDto; Body: UserUpdateDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const { email, password, role } = request.body;
    const result = await userService.update(id, { email, password, role });

    switch (result.status) {
      case "success":
        return reply.status(200).send();
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
    }
  }

  async deleteUser(request: FastifyRequest<{ Params: UserParamsDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await userService.delete(id);

    switch (result.status) {
      case "success":
        return reply.status(204).send();
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
    }
  }
}

export const userController = new UserController();
