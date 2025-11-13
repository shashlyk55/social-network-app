import { Post } from 'src/entities/post.entity';
import {
  CreatePostParams,
  FindAllPostsParams,
  FindAllPostsResult,
  UpdatePostParams,
} from '../types/post-service.types';

export interface IPostsService {
  create(params: CreatePostParams): Promise<Post>;
  findAll(params: FindAllPostsParams): Promise<FindAllPostsResult>;
  findByAuthor(
    authorId: number,
    params: FindAllPostsParams,
  ): Promise<FindAllPostsResult>;
  findOne(postId: number): Promise<Post>;
  update(
    postId: number,
    userId: number,
    params: UpdatePostParams,
  ): Promise<Post>;
  remove(postId: number, userId: number): Promise<void>;
}
