export type SuccessServiceResult<T> = { status: 'success'; data: T };
export type FailedServiceResult = { status: 'failed'; message: string };
export type UnauthorizedServiceResult = {
  status: 'unauthorized';
  message: string;
};
export type NotFoundServiceResult = { status: 'not_found'; message: string };
export type FatalServiceResult = { status: 'fatal'; message: string };

export function successServiceResult<T>(data: T): SuccessServiceResult<T> {
  return {
    status: 'success',
    data,
  };
}

export function failedServiceResult(message?: string): FailedServiceResult {
  return {
    status: 'failed',
    message: message ?? 'Bad Request',
  };
}

export function unauthorizedServiceResult(
  message?: string,
): UnauthorizedServiceResult {
  return {
    status: 'unauthorized',
    message: message ?? 'Unauthorized',
  };
}

export function notFoundServiceResult(
  entity: string,
  id: string,
): NotFoundServiceResult {
  return {
    status: 'not_found',
    message: `${entity} with id=${id} not found`,
  };
}

export function fatalServiceResult(): FatalServiceResult {
  return {
    status: 'fatal',
    message: `Internal server error`,
  };
}
