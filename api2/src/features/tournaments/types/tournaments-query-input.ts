export const TOURNAMENT_SORT_BY_FIELDS = [
  'name',
  'startDate',
  'endtDate',
  'createdAt',
  'updatedAt',
] as const;

export interface TournamentsQueryInput {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  sortBy?: (typeof TOURNAMENT_SORT_BY_FIELDS)[number];
  sortOrder?: 'asc' | 'desc';
}
