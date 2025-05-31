import { UserRole } from './user-role';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
}

export interface UserFilter {
  search?: string;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'dec';
}
