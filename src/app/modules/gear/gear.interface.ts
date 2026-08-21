export interface IGearQuery {
  search?: string;
  category?: string;
  price?: number | string;
  brand?: string;
  page?: number | string;
  limit?: number | string;
  condition?: string;
  sortBy?: string;
  sortOrder?: string;
}
