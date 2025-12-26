import { DomainException } from '../../common/exceptions/domain.excpetion';

export class InvalidCredentials extends DomainException {
  code = 'INVALID_CREDENTIALS';

  constructor() {
    super('Ivalid credentials');
  }
}

export class InvalidTokenFormat extends DomainException {
  code = 'INVALID_TOKEN_FORMAT';

  constructor() {
    super('Invalid token format');
  }
}

export class AccessTokenInBlacklist extends DomainException {
  code = 'ACCESS_TOKEN_IN_BLACKLIST';

  constructor() {
    super('Access token in blacklist');
  }
}

export class RefreshTokenInBlacklist extends DomainException {
  code = 'REFRESH_TOKEN_IN_BLACKLIST';

  constructor() {
    super('Refresh token in blacklist');
  }
}

export class UserDisabled extends DomainException {
  code = 'USER_DISABLED';

  constructor() {
    super('User disabled');
  }
}

export class AuthOperationException extends DomainException {
  code = 'AUTH_OPERATION_FAILED';

  constructor(operation: string, reason?: string) {
    super(
      reason ? `Failed to ${operation}: ${reason}` : `Failed to ${operation}`,
    );
  }
}
