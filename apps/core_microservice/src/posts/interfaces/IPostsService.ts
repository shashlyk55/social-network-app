import { Post } from 'src/entities/post.entity';
import {
  ArchivePostParams,
  CreatePostParams,
  FindAllPostsParams,
  FindAllPostsResult,
  FindArchivedPostsParams,
  FindArchivedPostsResult,
  LikePostResult,
  PostIdParams,
  UpdatePostParams,
  UserPostParams,
} from '../types/post-service.types';

export interface IPostsService {
  create(params: CreatePostParams): Promise<Post>;
  findAll(params: FindAllPostsParams): Promise<FindAllPostsResult>;
  findByAuthor(
    authorId: number,
    params: FindAllPostsParams,
  ): Promise<FindAllPostsResult>;
  findOne(params: PostIdParams & { currentUserId?: number }): Promise<Post>;
  update(params: UserPostParams & UpdatePostParams): Promise<Post>;
  remove(params: UserPostParams): Promise<void>;

  incrementCommentsCount(params: PostIdParams): Promise<void>;
  decrementCommentsCount(params: PostIdParams): Promise<void>;

  likePost(params: UserPostParams): Promise<LikePostResult>;

  archivePost(params: ArchivePostParams): Promise<Post>;
  unarchivePost(params: UserPostParams): Promise<Post>;
  findArchivedPosts(
    params: FindArchivedPostsParams,
  ): Promise<FindArchivedPostsResult>;
  isPostArchived(postId: number): Promise<boolean>;
}
