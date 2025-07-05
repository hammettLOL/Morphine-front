export interface PagedResult<T> {
    totalPages: number;
    totalCount: number;
    totalGross: number;
    totalNet: number;
    items: T[];
  }