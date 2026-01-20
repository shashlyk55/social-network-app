export type UpdateProfileParams = {
  username?: string;
  displayName?: string;
  birthday?: Date | null;
  bio?: string | null;
  avatarUrl?: string | null;
  isPublic?: boolean;
  updatedById: number;
};

export type CreateProfileParams = {
  userId: number;
  username: string;
  displayName: string;
  birthday?: Date | null;
  bio?: string | null;
  avatarUrl?: string | null;
  isPublic?: boolean;
  createdById: number;
};

export type ProfileBaseInfo = {
  id: number;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  followersCount: number;
  followingCount: number;
  isPublic: boolean;
};

export type ProfileView = ProfileBaseInfo & {
  postsCount?: number; // Только для своего или публичного
  isFollowed?: boolean; // Подписан ли текущий юзер на него
  isOwner: boolean; // Является ли профиль моим
  canViewPosts: boolean; // Можно ли смотреть посты
};
