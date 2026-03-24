export const EVENT_SORT_BY_FIELDS = [
  'name',
  'startDate',
  'endtDate',
  'createdAt',
  'updatedAt',
] as const;

export interface EventsQueryInput {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: (typeof EVENT_SORT_BY_FIELDS)[number];
  sortOrder?: 'asc' | 'desc';
}
