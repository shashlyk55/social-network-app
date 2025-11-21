import { DomainException } from 'src/app/exceptions/domain.exception';

export class PostNotFoundException extends DomainException {
  code = 'POST_NOT_FOUND';

  constructor(postId?: string | number) {
    super(postId ? `Post with id ${postId} not found` : `Post not found`);
  }
}

export class PostAlreadyLikedException extends DomainException {
  code = 'POST_ALREADY_LIKED';

  constructor(postId: number, profileId: number) {
    super(`Post ${postId} is already liked by profile ${profileId}`);
  }
}

export class PostOperationException extends DomainException {
  code = 'POST_OPERATION_FAILED';

  constructor(operation: string, reason?: string) {
    super(
      reason ? `Failed to ${operation}: ${reason}` : `Failed to ${operation}`,
    );
  }
}

export class PostAccessDeniedException extends DomainException {
  code = 'POST_ACCESS_DENIED';

  constructor(profileId: number, postId: number) {
    super(`Profile ${profileId} does not have access to post ${postId}`);
  }
}
