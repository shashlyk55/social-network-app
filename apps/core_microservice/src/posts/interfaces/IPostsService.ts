import { PostLike } from 'src/entities/many-to-many/post-like.entity';
import { Post } from 'src/entities/post.entity';
import {
  CreatePostParams,
  FindPostsParams,
  PostPaginationResult,
  UpdatePostParams,
  CreatePostLikeParams,
  FindProfilePostsParams,
} from '../types/post-service.types';

export interface IPostsService {
  create(params: CreatePostParams): Promise<Post>;
  findAll(params: FindPostsParams): Promise<PostPaginationResult>;
  findOne(id: number): Promise<Post>;
  update(params: UpdatePostParams): Promise<Post>;
  remove(id: number): Promise<void>;
  archive(id: number, updatedById: number): Promise<Post>;
  likePost(params: CreatePostLikeParams): Promise<PostLike>;
  findProfilePosts(
    //profileId: number,
    params: FindProfilePostsParams,
  ): Promise<PostPaginationResult>;
}
