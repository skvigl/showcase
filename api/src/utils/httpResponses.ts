export function badRequestError(message: string) {
  return { code: 400, reason: "Bad Request", message };
}

export function notFoundError(message: string) {
  return { code: 404, reason: "Not Found", message };
}

export function internalError() {
  return { code: 500, reason: "Internal Server Error" };
}
