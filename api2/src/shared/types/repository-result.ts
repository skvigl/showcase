export type SuccessRepositoryResult<T> = { status: 'success'; data: T };
export type NotFoundRepositoryResult = { status: 'not_found' };
export type ConstraintRepositoryResult = { status: 'constraint' };
export type FatalRepositoryResult = { status: 'fatal' };

export function successRepositoryResult<T>(
  data: T,
): SuccessRepositoryResult<T> {
  return {
    status: 'success',
    data,
  };
}

export function notFoundRepositoryResult(): NotFoundRepositoryResult {
  return {
    status: 'not_found',
  };
}

export function constraintRepositoryResult(): ConstraintRepositoryResult {
  return {
    status: 'constraint',
  };
}

export function fatalRepositoryResult(): FatalRepositoryResult {
  return {
    status: 'fatal',
  };
}
