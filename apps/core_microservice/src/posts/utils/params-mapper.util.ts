import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import {
  CreatePostParams,
  FindAllPostsParams,
  UpdatePostParams,
} from '../types/post-service.types';

export class PostsParamsMapper {
  static toCreatePostParams(
    userId: number,
    dto: CreatePostDto,
  ): CreatePostParams {
    return {
      authorId: userId,
      content: dto.content,
      location: dto.location,
      assetIds: dto.assetIds,
    };
  }

  static toFindAllPostsParams(query: any): FindAllPostsParams {
    return {
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
      search: query.search,
      authorId: query.authorId ? parseInt(query.authorId) : undefined,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
  }

  static toUpdatePostParams(
    userId: number,
    postId: number,
    dto: UpdatePostDto,
  ): UpdatePostParams {
    return {
      content: dto.content,
      location: dto.location,
      assetIds: dto.assetIds,
    };
  }
}
