export interface Profile {
  id: number;
  displayName: string;
  username: string;
  birthday: string;
  bio: string | null;
  avatarUrl: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;

  // Агрегированные данные (обычно добавляются маппером на бэкенде)
  _count?: {
    posts: number;
    followers: number;
    following: number;
  };

  // Статус текущего пользователя относительно этого профиля
  isFollowing?: boolean;
}

export type UpdateProfileDto = Pick<
  Profile,
  "username" | "displayName" | "birthday" | "bio" | "isPublic"
> & {
  avatar?: File | null;
};

export enum AccountProviderType {
  LOCAL = "local",
  GOOGLE = "google",
}

export type SignupCredentials = Pick<
  Profile,
  "username" | "displayName" | "birthday" | "isPublic"
> & {
  avatar?: File | null;
  email: string;
  password: string;
  provider: AccountProviderType;
};

export type LoginCredentials = {
  password: string;
  email: string;
};
