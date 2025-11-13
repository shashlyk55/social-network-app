export type CreateUserParams = {
  email: string;
  password: string;
  name: string;
  bio?: string;
};

export type FindAllUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'user' | 'admin';
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

export type FindAllUsersResult = {
  users: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UpdateUserParams = {
  email?: string;
  name?: string;
  bio?: string;
  avatarId?: number;
  role?: 'user' | 'admin' | string;
};
