import { User } from 'src/entities/user.entity';

export interface CreateUserParams {
  role: string;
  disabled?: boolean;
  createdById?: number;
}

export interface UpdateUserParams {
  id: number;
  role?: string;
  disabled?: boolean;
  updatedById?: number;
}

export interface FindUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  disabled?: boolean;
}

export interface UserPaginationResult {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
