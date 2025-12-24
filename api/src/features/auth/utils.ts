import { FastifyRequest, RouteGenericInterface } from "fastify";

import { UserRoles } from "../users/user.schema.js";

export function requireRole<RouteGeneric extends RouteGenericInterface = {}>(allowedRoles: UserRoles[] = []) {
  return async (request: FastifyRequest<RouteGeneric>) => {
    await request.jwtVerify();

    const userRole = request.user.role;

    if (userRole !== "admin" && !allowedRoles.includes(userRole)) {
      throw request.server.httpErrors.forbidden("Access denied");
    }
  };
}
