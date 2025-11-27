import { Type } from "@sinclair/typebox";

export const BadRequestErrorSchema = Type.Object({
  code: Type.Number({ default: 400 }),
  reason: Type.String({ default: "Bad Request" }),
  message: Type.Optional(Type.String()),
});

export const UnauthorizedErrorSchema = Type.Object({
  code: Type.Number({ default: 401 }),
  reason: Type.String({ default: "Unauthorized" }),
  message: Type.Optional(Type.String()),
});

export const NotFoundErrorSchema = Type.Object({
  code: Type.Number({ default: 404 }),
  reason: Type.String({ default: "Not Found" }),
  message: Type.Optional(Type.String()),
});

export const InternalErrorSchema = Type.Object({
  code: Type.Number({ default: 500 }),
  reason: Type.String({ default: "Internal Server Error" }),
});
