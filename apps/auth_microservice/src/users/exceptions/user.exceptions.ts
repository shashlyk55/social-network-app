import { InfrastructureException } from '../../common/exceptions/infrastructure.exception';
import { DomainException } from '../../common/exceptions/domain.exception';

export class UserNotFoundException extends DomainException {
  code = 'USER_NOT_FOUND';

  constructor(userId?: string | number) {
    super(userId ? `User with id ${userId} not found` : `User not found`);
  }
}

export class ProfileNotFoundException extends DomainException {
  code = 'PROFILE_NOT_FOUND';

  constructor(profileId?: string | number) {
    super(
      profileId
        ? `Profile with id ${profileId} not found`
        : `Profile not found`,
    );
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

export class UserDisabled extends DomainException {
  code = 'USER_DISABLED';

  constructor() {
    super('User disabled');
  }
}

export class UserOperationException extends InfrastructureException {
  code = 'USER_OPERATION_FAILED';

  constructor(operation: string, reason?: string) {
    super(
      reason ? `Failed to ${operation}: ${reason}` : `Failed to ${operation}`,
    );
  }
}
