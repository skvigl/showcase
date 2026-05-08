export type SimpleCollection<T> = {
  items: T[];
};

export type PaginatedCollection<T> = {
  meta: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  items: T[];
};
