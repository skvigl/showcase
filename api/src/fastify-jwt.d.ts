import "@fastify/jwt";
import { JwtPayload } from "./features/auth/auth.types.js";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}
