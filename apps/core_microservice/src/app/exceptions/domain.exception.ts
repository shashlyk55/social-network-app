export abstract class DomainException extends Error {
  abstract code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export {
  UserNotFoundException,
  UsernameAlreadyExistsException,
  EmailAlreadyExistsException,
  UserOperationException,
} from '../../users/exceptions/user.exceptions';

export {
  PostNotFoundException,
  PostAlreadyLikedException,
  PostOperationException,
  PostAccessDeniedException,
} from '../../posts/exceptions/post-domain.exceptions';

export {
  CommentNotFoundException,
  ParentCommentNotFoundException,
  CommentWithRepliesException,
  CommentAlreadyLikedException,
  CommentOperationException,
  CommentAccessDeniedException,
} from '../../comments/exceptions/comment-domain.exceptions';

export {
  ChatNotFoundException,
  ChatParticipantNotFoundException,
  ChatAlreadyExistsException,
  ChatParticipantAlreadyExistsException,
  ChatAccessDeniedException,
  ChatOperationException,
  ChatValidationException,
  InsufficientParticipantsException,
  InvalidChatTypeException,
  ChatParticipantRoleException,
} from '../../chats/exceptions/chat-domain.exceptions';
