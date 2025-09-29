export interface UserQueryParams {
  page: number;
  limit: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  search: string;
}
