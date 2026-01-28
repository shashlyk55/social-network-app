import { PostAsset } from "./asset";
import { ProfilePreview } from "./profile";

export interface BasePost {
  id: number;
  content: string;
  profile: ProfilePreview;
  createdAt: Date;
}

export interface PostView extends BasePost {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
  postAssets: PostAsset[];
}

export interface FindPostsParams {
  authorProfileId: number;
  isArchived?: boolean;
}

export interface PostLike {
  postId: number;
  isLiked: boolean;
  likesCount: number;
}

export interface CreatePost {
  content: string;
  isArchived?: boolean;
  assetIds?: number[];
}
