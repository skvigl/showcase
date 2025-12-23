import { PrismaClient } from "../generated/prisma/client.js";
import { adapter } from "./db.js";

export const prisma = new PrismaClient({
  adapter,
});
