import { DomainException } from 'src/app/exceptions/domain.exception';

export class ChatNotFoundException extends DomainException {
  code = 'CHAT_NOT_FOUND';

  constructor(chatId?: string | number) {
    super(chatId ? `Chat with id ${chatId} not found` : `Chat not found`);
  }
}

export class ChatParticipantNotFoundException extends DomainException {
  code = 'CHAT_PARTICIPANT_NOT_FOUND';

  constructor(participantId?: string | number) {
    super(
      participantId
        ? `Chat participant with id ${participantId} not found`
        : `Chat participant not found`,
    );
  }
}

export class ChatAlreadyExistsException extends DomainException {
  code = 'CHAT_ALREADY_EXISTS';

  constructor(chatName: string) {
    super(`Chat with name "${chatName}" already exists`);
  }
}

export class ChatParticipantAlreadyExistsException extends DomainException {
  code = 'CHAT_PARTICIPANT_ALREADY_EXISTS';

  constructor(chatId: number, profileId: number) {
    super(`Profile ${profileId} is already a participant in chat ${chatId}`);
  }
}

export class ChatAccessDeniedException extends DomainException {
  code = 'CHAT_ACCESS_DENIED';

  constructor(profileId: number, chatId: number) {
    super(`Profile ${profileId} does not have access to chat ${chatId}`);
  }
}

export class ChatOperationException extends DomainException {
  code = 'CHAT_OPERATION_FAILED';

  constructor(operation: string, reason?: string) {
    super(
      reason ? `Failed to ${operation}: ${reason}` : `Failed to ${operation}`,
    );
  }
}

export class ChatValidationException extends DomainException {
  code = 'CHAT_VALIDATION_FAILED';

  constructor(
    message: string,
    public details?: any,
  ) {
    super(`Chat validation failed: ${message}`);
  }
}

export class InsufficientParticipantsException extends DomainException {
  code = 'INSUFFICIENT_PARTICIPANTS';

  constructor(minParticipants: number) {
    super(`Chat must have at least ${minParticipants} participants`);
  }
}

export class InvalidChatTypeException extends DomainException {
  code = 'INVALID_CHAT_TYPE';

  constructor(chatType: string) {
    super(`Invalid chat type: ${chatType}`);
  }
}

export class ChatParticipantRoleException extends DomainException {
  code = 'INSUFFICIENT_PERMISSIONS';

  constructor(operation: string, requiredRole: string) {
    super(`Operation "${operation}" requires role: ${requiredRole}`);
  }
}
