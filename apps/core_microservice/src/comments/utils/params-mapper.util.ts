import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CommentResponseDto } from '../dto/comment-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import {
  CreateCommentParams,
  UpdateCommentParams,
  CommentPaginationResult,
} from '../types/comment-service.types';
import { Comment } from 'src/entities/comment.entity';

export class CommentMappers {
  static toCreateParams(dto: CreateCommentDto): CreateCommentParams {
    return {
      content: dto.content,
      postId: dto.postId,
      parentCommentId: dto.parentCommentId,
    };
  }

  static toUpdateParams(dto: UpdateCommentDto): UpdateCommentParams {
    return {
      content: dto.content,
      updatedById: dto.updatedById,
    };
  }

  static toCommentResponse(comment: Comment): CommentResponseDto {
    const response: CommentResponseDto = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      postId: comment.postId,
      profileId: comment.profileId,
      parentCommentId: comment.parentCommentId,
      createdById: comment.createdById,
      updatedById: comment.updatedById,
      profile: {
        id: comment.profile.id,
        username: comment.profile.username,
        displayName: comment.profile.displayName,
      },
      likesCount: comment.likesCount,
      repliesCount: comment.repliesCount,
      isLiked: comment.isLiked,
    };

    return response;
  }

  static toPaginationResponse(
    result: CommentPaginationResult,
  ): PaginationDto<CommentResponseDto> {
    return {
      data: result.data.map((comment) => this.toCommentResponse(comment)),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}
