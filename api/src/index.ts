import "dotenv/config";

import "./sentry.js";
import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import * as Sentry from "@sentry/node";

import { playerRoutes } from "./features/players/player.route.js";
import { teamRoutes } from "./features/teams/team.route.js";
import { eventRoutes } from "./features/events/event.route.js";
import { matchRoutes } from "./features/matches/match.route.js";
import { userRoutes } from "./features/users/user.route.js";
import { authRoutes } from "./features/auth/auth.route.js";
import { internalError, badRequestError, unauthorizedError } from "./utils/httpResponses.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const apiPrefix = "/api/v1";

const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
        ignore: "pid,hostname",
        colorize: true,
      },
    },
  },
});

Sentry.setupFastifyErrorHandler(app);

app.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(",") || [],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

app.register(cookie);

export const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is required.");
  process.exit(1);
}

app.register(jwt, {
  secret: JWT_SECRET,
});

app.register(swagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Showcase swagger",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
});

app.register(swaggerUi, {
  routePrefix: `${apiPrefix}/docs`,
});

app.setErrorHandler((error, request, reply) => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const model = error.meta?.modelName ?? "record";
      return reply.status(400).send(badRequestError(`Unique constraint failed on ${model}`));
    }
  }

  if (error.validation) {
    return reply.status(400).send(badRequestError(error.message));
  }

  if (error.statusCode === 401) {
    return reply.status(401).send(unauthorizedError(error.message));
  }

  console.error("Unexpected error:", error);
  reply.status(500).send(internalError());
});

app.register(playerRoutes, { prefix: apiPrefix });
app.register(teamRoutes, { prefix: apiPrefix });
app.register(eventRoutes, { prefix: apiPrefix });
app.register(matchRoutes, { prefix: apiPrefix });
app.register(userRoutes, { prefix: apiPrefix });
app.register(authRoutes, { prefix: apiPrefix });

app.get(`${apiPrefix}/`, async () => "Hello API!");

async function start() {
  try {
    await app.listen({ host: process.env.HOST, port: Number(process.env.PORT) });
    console.log("Server started");
  } catch (err) {
    console.error("Error when starting the server:", err);
    process.exit(1);
  }
}

start();
