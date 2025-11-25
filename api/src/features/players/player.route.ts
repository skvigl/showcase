import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import {
  PlayerSchema,
  PlayerListSchema,
  PlayerCreateSchema,
  PlayerParamsSchema,
  PlayerQuerySchema,
  PlayerUpdateSchema,
} from "./player.schema.js";
import { BadRequestErrorSchema, InternalErrorSchema, NotFoundErrorSchema } from "../../error.schema.js";
import { playerController } from "./player.controller.js";

export function playerRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/players",
    {
      schema: {
        querystring: PlayerQuerySchema,
        tags: ["players"],
        response: {
          200: PlayerListSchema,
          500: InternalErrorSchema,
        },
      },
    },
    playerController.getAllPlayers
  );

  fastify.get(
    "/players/:id",
    {
      schema: {
        params: PlayerParamsSchema,
        tags: ["players"],
        response: {
          200: PlayerSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    playerController.getPlayerById
  );

  fastify.post(
    "/players",
    {
      schema: {
        body: PlayerCreateSchema,
        tags: ["players"],
        response: {
          201: PlayerSchema,
          400: BadRequestErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    playerController.createPlayer
  );

  fastify.put(
    "/players/:id",
    {
      schema: {
        params: PlayerParamsSchema,
        body: PlayerUpdateSchema,
        tags: ["players"],
        response: {
          200: Type.Null(),
          400: BadRequestErrorSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    playerController.updatePlayer
  );

  fastify.delete(
    "/players/:id",
    {
      schema: {
        params: PlayerParamsSchema,
        tags: ["players"],
        response: {
          204: Type.Null(),
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    playerController.deletePlayer
  );
}
