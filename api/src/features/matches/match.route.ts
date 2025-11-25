import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { matchController } from "./match.controller.js";
import {
  MatchCreateSchema,
  MatchListSchema,
  MatchParamsSchema,
  MatchSchema,
  MatchUpdateSchema,
} from "./match.schema.js";
import { BadRequestErrorSchema, InternalErrorSchema, NotFoundErrorSchema } from "../../error.schema.js";

export async function matchRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/matches",
    {
      schema: {
        tags: ["matches"],
        response: {
          200: MatchListSchema,
          500: InternalErrorSchema,
        },
      },
    },
    matchController.getAllMatches
  );

  fastify.get(
    "/matches/:id",
    {
      schema: {
        params: MatchParamsSchema,
        tags: ["matches"],
        response: {
          200: MatchSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    matchController.getMatchById
  );

  fastify.post(
    "/matches",
    {
      schema: {
        body: MatchCreateSchema,
        tags: ["matches"],
        response: {
          201: MatchSchema,
          400: BadRequestErrorSchema,
          500: InternalErrorSchema,
        },
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
        tags: ["matches"],
        response: {
          200: Type.Null(),
          400: BadRequestErrorSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    matchController.updateMatch
  );
}
