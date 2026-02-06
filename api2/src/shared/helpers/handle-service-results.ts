import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  FailedServiceResult,
  FatalServiceResult,
  NotFoundServiceResult,
  SuccessServiceResult,
} from '../types/service-result';

export function handleServiceResult<T>(
  result:
    | SuccessServiceResult<T>
    | NotFoundServiceResult
    | FailedServiceResult
    | FatalServiceResult,
): T {
  switch (result.status) {
    case 'success':
      return result.data;
    case 'not_found':
      throw new NotFoundException(result.message);
    case 'failed':
      throw new BadRequestException(result.message);
    case 'fatal':
    default:
      throw new InternalServerErrorException();
  }
}
