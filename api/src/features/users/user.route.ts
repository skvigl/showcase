import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { userController } from "./user.controller.js";
import { UserSchema, UserParamsSchema, UserCreateSchema, UserUpdateSchema } from "./user.schema.js";

import {
  BadRequestErrorSchema,
  UnauthorizedErrorSchema,
  NotFoundErrorSchema,
  InternalErrorSchema,
} from "../../error.schema.js";

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/users",
    {
      schema: {
        tags: ["users"],
        response: {
          200: Type.Array(UserSchema),
          500: InternalErrorSchema,
        },
      },
      onRequest: async (request, reply) => {
        await request.jwtVerify();
      },
    },
    userController.getAllUsers
  );

  fastify.get(
    "/users/:id",
    {
      schema: {
        tags: ["users"],
        params: UserParamsSchema,
        response: {
          200: UserSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: async (request, reply) => {
        await request.jwtVerify();
      },
    },
    userController.getUserById
  );

  fastify.post(
    "/users",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        body: UserCreateSchema,
        tags: ["users"],
        response: {
          201: UserSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: async (request, reply) => {
        await request.jwtVerify();
      },
    },
    userController.createUser
  );

  fastify.put(
    "/users/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: UserParamsSchema,
        body: UserUpdateSchema,
        tags: ["users"],
        response: {
          200: Type.Null(),
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: async (request, reply) => {
        await request.jwtVerify();
      },
    },
    userController.updateUser
  );

  fastify.delete(
    "/users/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: UserParamsSchema,
        tags: ["users"],
        response: {
          204: Type.Null(),
          401: UnauthorizedErrorSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: async (request, reply) => {
        await request.jwtVerify();
      },
    },
    userController.deleteUser
  );
}
