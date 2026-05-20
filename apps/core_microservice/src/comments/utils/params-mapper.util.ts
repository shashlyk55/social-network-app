import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CreateCommentLikeDto } from '../dto/create-comment-like.dto';
import { CommentResponseDto } from '../dto/comment-response.dto';
import {
  PaginationResponseDto,
  PaginationMetaDto,
} from '../../common/dto/pagination-response.dto';
import {
  CreateCommentParams,
  UpdateCommentParams,
  CreateCommentLikeParams,
  CommentPaginationResult,
} from '../types/comment-service.types';
import { Comment } from 'src/entities/comment.entity';

export class CommentMappers {
  static toCreateParams(dto: CreateCommentDto): CreateCommentParams {
    return {
      content: dto.content,
      postId: dto.postId,
      profileId: dto.profileId,
      parentCommentId: dto.parentCommentId,
      createdById: dto.createdById,
    };
  }

  static toUpdateParams(
    id: number,
    dto: UpdateCommentDto,
  ): UpdateCommentParams {
    return {
      id,
      content: dto.content,
      updatedById: dto.updatedById,
    };
  }

  static toCreateCommentLikeParams(
    commentId: number,
    dto: CreateCommentLikeDto,
  ): CreateCommentLikeParams {
    return {
      commentId,
      profileId: dto.profileId,
      createdById: dto.createdById,
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
      // createdBy: {
      //   id: comment.createdBy.id,
      //   role: comment.createdBy.role,
      // },
      // likes: [],
      // replies: [],
      likesCount: comment.commentLikes ? comment.commentLikes.length : 0,
      repliesCount: comment.replies ? comment.replies.length : 0,
    };

    // if (comment.updatedBy) {
    //   response.updatedBy = {
    //     id: comment.updatedBy.id,
    //     role: comment.updatedBy.role,
    //   };
    // }

    // if (comment.commentLikes) {
    //   response.likes = comment.commentLikes.map((like) => ({
    //     id: like.id,
    //     profileId: like.profileId,
    //     createdAt: like.createdAt,
    //     profile: {
    //       id: like.profile.id,
    //       username: like.profile.username,
    //       displayName: like.profile.displayName,
    //     },
    //   }));
    // }

    // if (comment.replies) {
    //   response.replies = comment.replies.map((reply) =>
    //     this.toCommentResponse(reply),
    //   );
    // }

    return response;
  }

  static toPaginationResponse(
    result: CommentPaginationResult,
  ): PaginationResponseDto<CommentResponseDto> {
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
