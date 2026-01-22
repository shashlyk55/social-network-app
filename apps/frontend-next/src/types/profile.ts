export interface BaseProfile {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  followersCount: number;
  followedCount: number;
  bio?: string | null;
  isPublic: boolean;
}

export interface MyProfile extends BaseProfile {
  birthday?: Date | null;
  postsCount: number;
  createdAt: Date;
}

export interface OtherProfile extends BaseProfile {
  isFollowed: boolean;
  isFollowAccepted: boolean;
  canViewFullProfile: boolean;
  publicPostsCount?: number;
}

export interface UpdateProfileInput {
  username?: string;
  displayName?: string;
  birthday?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  isPublic?: boolean;
}

export interface ProfilePreview {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  isFollowed: boolean;
}
