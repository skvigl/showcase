export type ServiceResult<T> =
  | { status: "success"; data: T }
  | { status: "failed"; message: string }
  | { status: "not_found"; message: string }
  | { status: "fatal" };

export function successResult<T>(data: T): ServiceResult<T> {
  return {
    status: "success",
    data,
  };
}

export function failedResult(message: string): ServiceResult<never> {
  return {
    status: "failed",
    message,
  };
}

export function notFoundResult(entity: string, id: number): ServiceResult<never> {
  return {
    status: "not_found",
    message: `${entity} with id=${id} not found`,
  };
}

export async function handleServiceError<T>(fn: () => Promise<T>, context: string): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[SERVICE ERROR]:[${context}]`, err);

    throw err;
  }
}
