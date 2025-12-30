export interface UpdateProfileParams {
  id: number;
  username?: string;
  displayName?: string;
  birthday?: Date;
  bio?: string | null;
  avatarUrl?: string | null;
  isPublic?: boolean;
  updatedById: number;
}
export type CreateProfileParams = {
  userId: number;
  username: string;
  displayName: string;
  birthday: Date;
  bio?: string | null;
  avatarUrl?: string | null;
  isPublic?: boolean;
  createdById: number;
};
