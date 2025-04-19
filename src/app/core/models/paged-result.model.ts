export interface PagedResult<T> {
    totalPages: number;
    totalElements: number;
    items: T[];
  }