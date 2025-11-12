// Типы для создания пользователя
export type CreateUserParams = {
  email: string;
  password: string;
  name: string;
  bio?: string;
};

// Типы для поиска и пагинации
export type FindAllUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  role?: 'user' | 'admin';
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

export type FindAllUsersResult = {
  users: any[]; // Заменим на конкретный тип
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Типы для обновления пользователя
export type UpdateUserParams = {
  email?: string;
  name?: string;
  bio?: string;
  avatarId?: string;
  isActive?: boolean;
  role?: 'user' | 'admin';
};

// Типы для операций с паролем
export type ChangePasswordParams = {
  userId: number;
  newPassword: string;
};

export type ValidatePasswordParams = {
  userId: number;
  password: string;
};

// Типы для статусов пользователя
export type UserStatusParams = {
  userId: number;
};
