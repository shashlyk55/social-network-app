import { DomainException } from 'src/app/exceptions/domain.exception';

export class CommentNotFoundException extends DomainException {
  code = 'COMMENT_NOT_FOUND';

  constructor(commentId?: string | number) {
    super(
      commentId
        ? `Comment with id ${commentId} not found`
        : `Comment not found`,
    );
  }
}

export class ParentCommentNotFoundException extends DomainException {
  code = 'PARENT_COMMENT_NOT_FOUND';

  constructor(parentCommentId: number) {
    super(`Parent comment with id ${parentCommentId} not found`);
  }
}

export class CommentWithRepliesException extends DomainException {
  code = 'COMMENT_HAS_REPLIES';

  constructor(commentId: number) {
    super(`Cannot delete comment ${commentId} because it has replies`);
  }
}

export class CommentAlreadyLikedException extends DomainException {
  code = 'COMMENT_ALREADY_LIKED';

  constructor(commentId: number, profileId: number) {
    super(`Comment ${commentId} is already liked by profile ${profileId}`);
  }
}

export class CommentOperationException extends DomainException {
  code = 'COMMENT_OPERATION_FAILED';

  constructor(operation: string, reason?: string) {
    super(
      reason ? `Failed to ${operation}: ${reason}` : `Failed to ${operation}`,
    );
  }
}

export class CommentAccessDeniedException extends DomainException {
  code = 'COMMENT_ACCESS_DENIED';

  constructor(profileId: number, commentId: number) {
    super(`Profile ${profileId} does not have access to comment ${commentId}`);
  }
}
