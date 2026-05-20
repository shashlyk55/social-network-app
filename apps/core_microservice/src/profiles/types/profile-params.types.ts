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
