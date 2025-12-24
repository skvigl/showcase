import { FastifyInstance } from "fastify";
import { Type } from "@sinclair/typebox";

import { eventController } from "./event.controller.js";
import {
  EventSchema,
  EventCreateSchema,
  EventParamsSchema,
  EventQuerySchema,
  EventUpdateSchema,
} from "./event.schema.js";
import {
  BadRequestErrorSchema,
  UnauthorizedErrorSchema,
  NotFoundErrorSchema,
  InternalErrorSchema,
} from "../../error.schema.js";
import { MatchSchema } from "../matches/match.schema.js";
import { TeamWithPointsSchema } from "../teams/team.schema.js";
import { requireRole } from "../auth/utils.js";

export async function eventRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/events",
    {
      schema: {
        tags: ["events"],
        response: {
          200: Type.Array(EventSchema),
          500: InternalErrorSchema,
        },
      },
    },
    eventController.getAllEvents
  );

  fastify.get(
    "/events/:id",
    {
      schema: {
        params: EventParamsSchema,
        tags: ["events"],
        response: {
          200: EventSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    eventController.getEventById
  );

  fastify.post(
    "/events",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        body: EventCreateSchema,
        tags: ["events"],
        response: {
          201: EventSchema,
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: requireRole(["creator"]),
    },
    eventController.createEvent
  );

  fastify.put(
    "/events/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: EventParamsSchema,
        body: EventUpdateSchema,
        tags: ["events"],
        response: {
          200: Type.Null(),
          400: BadRequestErrorSchema,
          401: UnauthorizedErrorSchema,
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: requireRole(["creator"]),
    },
    eventController.updateEvent
  );

  fastify.delete(
    "/events/:id",
    {
      schema: {
        security: [{ bearerAuth: [] }],
        params: EventParamsSchema,
        tags: ["events"],
        response: {
          204: Type.Null(),
          404: NotFoundErrorSchema,
          401: UnauthorizedErrorSchema,
          500: InternalErrorSchema,
        },
      },
      onRequest: requireRole(),
    },
    eventController.deleteEvent
  );

  fastify.get(
    "/events/:id/featured-matches",
    {
      schema: {
        params: EventParamsSchema,
        tags: ["events"],
        response: {
          200: Type.Array(MatchSchema),
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    eventController.getEventFeaturedMatches
  );

  fastify.get(
    "/events/:id/leaderboard",
    {
      schema: {
        params: EventParamsSchema,
        querystring: EventQuerySchema,
        tags: ["events"],
        response: {
          200: Type.Array(TeamWithPointsSchema),
          404: NotFoundErrorSchema,
          500: InternalErrorSchema,
        },
      },
    },
    eventController.getEventLeaderboard
  );
}
