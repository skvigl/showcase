export type successResult<T> = { status: "success"; data: T };
export type failedResult = { status: "failed"; message: string };
export type notFoundResult = { status: "not_found"; message: string };
export type invalidCredentialsResult = { status: "invalid_credentials" };
export type unauthorizedResult = { status: "unauthorized" };

export type ServiceResult<T> =
  | successResult<T>
  | failedResult
  | notFoundResult
  | invalidCredentialsResult
  | unauthorizedResult;

export function successResult<T>(data: T): successResult<T> {
  return {
    status: "success",
    data,
  };
}

export function failedResult(message: string): failedResult {
  return {
    status: "failed",
    message,
  };
}

export function notFoundResult(entity: string, id: number): notFoundResult {
  return {
    status: "not_found",
    message: `${entity} with id=${id} not found`,
  };
}

export function invalidCredentialsResult(): invalidCredentialsResult {
  return {
    status: "invalid_credentials",
  };
}

export function unauthorizedResult(): unauthorizedResult {
  return {
    status: "unauthorized",
  };
}

export async function handleServiceError<R extends ServiceResult<unknown>>(
  fn: () => Promise<R>,
  context: string
): Promise<R> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[SERVICE ERROR]:[${context}]`);
    throw err;
  }
}
