import { Static } from "@sinclair/typebox";
import { BadRequestErrorSchema, InternalErrorSchema, NotFoundErrorSchema } from "../error.schema.js";

export function badRequestError(message: string): Static<typeof BadRequestErrorSchema> {
  return { code: 400, reason: "Bad Request", message };
}

export function notFoundError(message: string): Static<typeof NotFoundErrorSchema> {
  return { code: 404, reason: "Not Found", message };
}

export function internalError(): Static<typeof InternalErrorSchema> {
  return { code: 500, reason: "Internal Server Error" };
}
