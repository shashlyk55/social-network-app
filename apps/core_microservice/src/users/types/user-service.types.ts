import { User } from 'src/entities/user.entity';

export type CreateUserParams = {
  role: string;
  disabled?: boolean;
  // createdById?: number;
  // Profile data
  username: string;
  displayName: string;
  birthday: string;
  bio?: string;
  avatarUrl?: string;
  isPublic?: boolean;
  // Account data
  email: string;
  password: string;
};

export type UpdateUserParams = {
  id: number;
  role?: string;
  disabled?: boolean;
  updatedById?: number;
  // Profile data
  username?: string;
  displayName?: string;
  birthday?: string;
  bio?: string;
  avatarUrl?: string;
  isPublic?: boolean;
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
