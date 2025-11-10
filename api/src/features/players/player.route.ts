import { FastifyInstance } from "fastify";

import { PlayerCreateSchema, PlayerParamsSchema, PlayerQuerySchema, PlayerUpdateSchema } from "./player.schema.js";
import { playerController } from "./player.controller.js";

export function playerRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/players",
    {
      schema: {
        querystring: PlayerQuerySchema,
      },
    },
    playerController.getAllPlayers
  );

  fastify.get(
    "/players/:id",
    {
      schema: {
        params: PlayerParamsSchema,
      },
    },
    playerController.getPlayerById
  );

  fastify.post(
    "/players",
    {
      schema: {
        body: PlayerCreateSchema,
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
      },
    },
    playerController.updatePlayer
  );

  fastify.delete(
    "/players/:id",
    {
      schema: {
        params: PlayerParamsSchema,
      },
    },
    playerController.deletePlayer
  );
}
