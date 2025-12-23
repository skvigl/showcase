import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function signJwt(payload: object, options?: jwt.SignOptions) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign(payload, JWT_SECRET, options);
}
