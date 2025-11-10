import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";

import { playerRoutes } from "./features/players/player.route.js";
import { teamRoutes } from "./features/teams/team.route.js";
import { eventRoutes } from "./features/events/event.route.js";
import { matchRoutes } from "./features/matches/match.route.js";
import { internalError, badRequestError } from "./utils/httpResponses.js";

const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
        colorize: true,
      },
    },
  },
});

app.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(",") || [],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

app.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    return reply.status(400).send(badRequestError(error.message));
  }

  console.error("Unexpected error:", error);
  reply.status(500).send(internalError());
});

const apiPrefix = "/api/v1";

app.register(playerRoutes, { prefix: apiPrefix });
app.register(teamRoutes, { prefix: apiPrefix });
app.register(eventRoutes, { prefix: apiPrefix });
app.register(matchRoutes, { prefix: apiPrefix });

app.get("/", async () => "Hello API!");

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
