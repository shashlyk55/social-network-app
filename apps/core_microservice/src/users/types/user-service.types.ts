import { User } from 'src/entities/user.entity';

export type CreateUserParams = {
  role: string;
  disabled?: boolean;
  createdById?: number;
};

export type UpdateUserParams = {
  id: number;
  role?: string;
  disabled?: boolean;
  updatedById?: number;
};

export type FindUsersParams = {
  page?: number;
  limit?: number;
  role?: string;
  disabled?: boolean;
};

export type UserPaginationResult = {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
