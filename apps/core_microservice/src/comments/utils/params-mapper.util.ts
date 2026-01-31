import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import {
  CreateCommentParams,
  UpdateCommentParams,
} from '../types/comment-service.types';

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
    };
  }
}
