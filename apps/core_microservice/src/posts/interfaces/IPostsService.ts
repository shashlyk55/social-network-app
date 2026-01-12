import { PostLike } from 'src/entities/many-to-many/post-like.entity';
import { Post } from 'src/entities/post.entity';
import {
  CreatePostParams,
  FindPostsParams,
  PostPaginationResult,
  UpdatePostParams,
} from '../types/post-service.types';

export interface IPostsService {
  create(params: CreatePostParams, userId: number): Promise<Post>;
  findAll(
    params: FindPostsParams,
    authorId: number,
    userId?: number,
  ): Promise<PostPaginationResult>;
  findOne(id: number): Promise<Post>;
  update(params: UpdatePostParams, userId: number): Promise<Post>;
  remove(postId: number, userId: number): Promise<void>;
  archive(id: number, updatedById: number): Promise<Post>;
  likePost(postId: number, createdById: number): Promise<PostLike>;
}
