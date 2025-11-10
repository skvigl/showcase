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

export function fatalResult(): ServiceResult<never> {
  return {
    status: "fatal",
  };
}

export function handleDbError(context: string, err: unknown) {
  console.error(`[DB ERROR] ${context}:`, err);
  return fatalResult();
}
