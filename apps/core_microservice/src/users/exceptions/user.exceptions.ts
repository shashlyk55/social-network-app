import { DomainException } from 'src/app/exceptions/domain.exception';

export class UserNotFoundException extends DomainException {
  code = 'USER_NOT_FOUND';

  constructor(userId?: string | number) {
    super(userId ? `User with id ${userId} not found` : `User not found`);
  }
}

export class UsernameAlreadyExistsException extends DomainException {
  code = 'USERNAME_ALREADY_EXISTS';

  constructor(username: string) {
    super(`Username "${username}" is already taken`);
  }
}

export class EmailAlreadyExistsException extends DomainException {
  code = 'EMAIL_ALREADY_EXISTS';

  constructor(email: string) {
    super(`Email "${email}" is already registered`);
  }
}

export class UserOperationException extends DomainException {
  code = 'USER_OPERATION_FAILED';

  constructor(operation: string, reason?: string) {
    super(
      reason ? `Failed to ${operation}: ${reason}` : `Failed to ${operation}`,
    );
  }
}
