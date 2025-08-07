export interface User {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UsersResponse {
  data: User[];
  pagination: PaginationInfo;
}

export interface FilterItem {
  hobby?: string;
  nationality?: string;
  count: number;
}

export interface FiltersResponse {
  topHobbies: FilterItem[];
  topNationalities: FilterItem[];
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  nationality?: string;
  hobbies?: string;
}
