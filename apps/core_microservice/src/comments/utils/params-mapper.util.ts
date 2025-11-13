import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import {
  CreateCommentParams,
  FindAllCommentsParams,
  UpdateCommentParams,
} from '../types/comment-service.types';

export class CommentsParamsMapper {
  static toCreateCommentParams(
    userId: number,
    dto: CreateCommentDto,
  ): CreateCommentParams {
    return {
      authorId: userId,
      postId: dto.postId,
      content: dto.content,
    };
  }

  static toFindAllCommentsParams(query: any): FindAllCommentsParams {
    return {
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
      postId: query.postId ? parseInt(query.postId) : undefined,
      authorId: query.authorId ? parseInt(query.authorId) : undefined,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
  }

  static toUpdateCommentParams(dto: UpdateCommentDto): UpdateCommentParams {
    return {
      content: dto.content,
    };
  }
}
