export type Paginated<T> = {
  meta: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  items: T[];
};
