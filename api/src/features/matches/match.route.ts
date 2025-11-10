import { FastifyInstance } from "fastify";

import { matchController } from "./match.controller.js";
import { MatchCreateSchema, MatchParamsSchema, MatchUpdateSchema } from "./match.schema.js";

export async function matchRoutes(fastify: FastifyInstance) {
  fastify.get("/matches", matchController.getAllMatches);

  fastify.get(
    "/matches/:id",
    {
      schema: {
        params: MatchParamsSchema,
      },
    },
    matchController.getMatchById
  );

  fastify.post(
    "/matches",
    {
      schema: {
        body: MatchCreateSchema,
      },
    },
    matchController.createMatch
  );

  fastify.put(
    "/matches/:id",
    {
      schema: {
        params: MatchParamsSchema,
        body: MatchUpdateSchema,
      },
    },
    matchController.updateMatch
  );
}
