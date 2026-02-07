import { DomainException } from 'src/app/exceptions/domain.exception';
import { ChatParticipantRole } from 'src/entities/many-to-many/chat-participants.entity';

export class UserAlreadyInChat extends DomainException {
  code = 'USER_ALREADY_IN_CHAT';

  constructor() {
    super('User is already in chat');
  }
}

export class UserNotInChat extends DomainException {
  code = 'USER_NOT_IN_CHAT';

  constructor() {
    super('The user is not in the chat');
  }
}

export class NotEnoughPermissions extends DomainException {
  code = 'NOT_ENOUGH_PERMISSIONS';

  constructor(requiredRole: ChatParticipantRole) {
    super(`Not permissions. You are not ${requiredRole}`);
  }
}

export class ChatParticipantOperationException extends DomainException {
  code = 'CHAT_PARTICIPANT_OPERATION_EXCEPTION';
  constructor(message: string) {
    super(message);
  }
}
