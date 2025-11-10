import { FastifyRequest, FastifyReply } from "fastify";

import { normalizeTeamId } from "../../utils/normalize.js";
import { badRequestError, internalError, notFoundError } from "../../utils/httpResponses.js";
import { playerService } from "./player.service.js";
import { PlayerCreateDto, PlayerParamsDto, PlayerQueryDto, PlayerUpdateDto } from "./player.schema.js";

export class PlayerController {
  async getAllPlayers(request: FastifyRequest<{ Querystring: PlayerQueryDto }>, reply: FastifyReply) {
    const result = await playerService.getAll(request.query);

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async getPlayerById(request: FastifyRequest<{ Params: PlayerParamsDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await playerService.getById(id);

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async createPlayer(request: FastifyRequest<{ Body: PlayerCreateDto }>, reply: FastifyReply) {
    const { firstName, lastName, power, teamId } = request.body;
    const result = await playerService.create({
      firstName,
      lastName,
      power,
      teamId: normalizeTeamId(teamId),
    });

    switch (result.status) {
      case "success":
        return reply.status(201).send(result.data);
      case "failed":
        return reply.status(400).send(badRequestError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async updatePlayer(request: FastifyRequest<{ Params: PlayerParamsDto; Body: PlayerUpdateDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const { firstName, lastName, power, teamId } = request.body;

    const result = await playerService.update(id, {
      firstName,
      lastName,
      power,
      teamId: normalizeTeamId(teamId),
    });

    switch (result.status) {
      case "success":
        return reply.status(200).send();
      case "failed":
        return reply.status(400).send(badRequestError(result.message));
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async deletePlayer(request: FastifyRequest<{ Params: PlayerParamsDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await playerService.delete(id);

    switch (result.status) {
      case "success":
        return reply.status(204).send();
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }
}

export const playerController = new PlayerController();
