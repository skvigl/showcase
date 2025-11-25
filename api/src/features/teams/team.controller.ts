import { FastifyRequest, FastifyReply } from "fastify";

import { teamService } from "./team.service.js";
import { TeamCreateDto, TeamParamsDto } from "./team.schema.js";
import { badRequestError, internalError, notFoundError } from "../../utils/httpResponses.js";

export class TeamController {
  async getAllTeams(request: FastifyRequest, reply: FastifyReply) {
    const result = await teamService.getAll();

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async getTeamById(request: FastifyRequest<{ Params: TeamParamsDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await teamService.getById(id);

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async createTeam(request: FastifyRequest<{ Body: TeamCreateDto }>, reply: FastifyReply) {
    const { name } = request.body;
    const result = await teamService.create({ name });

    switch (result.status) {
      case "success":
        return reply.status(201).send(result.data);
      case "failed":
        return reply.status(400).send(badRequestError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async updateTeam(request: FastifyRequest<{ Params: TeamParamsDto; Body: TeamCreateDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const { name } = request.body;
    const result = await teamService.update(id, { name });

    switch (result.status) {
      case "success":
        return reply.status(200).send();
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async deleteTeam(request: FastifyRequest<{ Params: TeamParamsDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await teamService.delete(id);

    switch (result.status) {
      case "success":
        return reply.status(204).send();
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async getTeamPlayers(request: FastifyRequest<{ Params: TeamParamsDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await teamService.getPlayers(id);

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async getTeamLastResults(request: FastifyRequest<{ Params: TeamParamsDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await teamService.getLastResults(id);

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }

  async getTeamFeaturedMatches(request: FastifyRequest<{ Params: TeamParamsDto }>, reply: FastifyReply) {
    const { id } = request.params;
    const result = await teamService.getFeaturedMatches(id);

    switch (result.status) {
      case "success":
        return reply.status(200).send(result.data);
      case "not_found":
        return reply.status(404).send(notFoundError(result.message));
      case "fatal":
        return reply.status(500).send(internalError());
    }
  }
}

export const teamController = new TeamController();
