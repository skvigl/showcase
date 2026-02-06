import { plainToInstance, ClassConstructor } from 'class-transformer';

export function mapToDto<T>(dtoClass: ClassConstructor<T>, data: unknown): T {
  return plainToInstance(dtoClass, data, {
    excludeExtraneousValues: true,
  });
}

export function mapToDtoArray<T>(
  dtoClass: ClassConstructor<T>,
  data: unknown[],
): T[] {
  return plainToInstance(dtoClass, data, {
    excludeExtraneousValues: true,
  });
}

export function mapToPaginatedDto<T>(
  dtoClass: ClassConstructor<T>,
  result: {
    meta: {
      pageNumber: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
    items: unknown[];
  },
) {
  return {
    meta: result.meta,
    items: mapToDtoArray(dtoClass, result.items),
  };
}
