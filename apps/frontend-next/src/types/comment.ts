import { ProfilePreview } from "./profile";

export interface CommentView {
  id: number;
  content: string;
  profile: ProfilePreview;
  postId: number;
  parentCommentId: number | null;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  repliesCount: number;
}

export interface CreateComment {
  content: string;
  postId: number;
  parentCommentId?: number | null;
}

export interface UpdateComment {
  content?: string;
}

export interface FindCommentsParams {
  postId?: number;
  // A parameter with a null value will not be included in the URL,
  // and on the backend this parameter will be undefined.
  parentCommentId?: number | null;
  page?: number;
  limit?: number;
  order?: "ASC" | "DESC";
}

export interface CommentLike {
  commentId: number;
  isLiked: boolean;
  likesCount: number;
}
