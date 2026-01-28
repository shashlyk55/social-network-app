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

export class NoAccessToThesePosts extends DomainException {
  code = 'NOT_ACCESS_TO_THESE_POSTS';

  constructor() {
    super('No access to these posts');
  }
}

export class PostAccessDeniedException extends DomainException {
  code = 'POST_ACCESS_DENIED';

  private constructor(message: string) {
    super(message);
  }

  static forSinglePost(profileId?: number, postId?: number) {
    if (profileId && postId) {
      return new PostAccessDeniedException(
        `Profile ${profileId} does not have access to post ${postId}`,
      );
    }
    return new PostAccessDeniedException('User does not have access to post');
  }

  static forManyPosts() {
    return new PostAccessDeniedException(
      'User does not have access to these posts',
    );
  }
}
