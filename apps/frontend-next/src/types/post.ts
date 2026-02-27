import { InfiniteData } from "@tanstack/react-query";
import { PostAsset } from "./asset";
import { ProfilePreview } from "./profile";
import { PaginatedData } from "./pagination";

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

export type FindPostsParams = {
  authorProfileId: number;
  isArchived?: boolean;
};

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

export interface UpdatePost {
  content?: string;
  assetIds?: number[];
}

export type PostCache = PostView | InfiniteData<PaginatedData<PostView>>;
