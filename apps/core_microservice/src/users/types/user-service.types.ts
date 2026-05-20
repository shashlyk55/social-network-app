import { User, UserRole } from 'src/entities/user.entity';

export type CreateUserParams = {
  role: UserRole;
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
  role?: UserRole;
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
  role?: UserRole;
  disabled?: boolean;
};

export type UserPaginationResult = {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
