import { InfrastructureException } from '../../common/exceptions/infrastructure.exception';
import { DomainException } from '../../common/exceptions/domain.exception';

export class InvalidCredentials extends DomainException {
  code = 'INVALID_CREDENTIALS';

  constructor() {
    super('Ivalid credentials');
  }
}

export class InvalidToken extends DomainException {
  code = 'INVALID_TOKEN';

  constructor() {
    super('Invalid token');
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

export class AuthOperationException extends InfrastructureException {
  code = 'AUTH_OPERATION_FAILED';

  // constructor(operation: string, reason?: string) {
  //   super(
  //     reason ? `Failed to ${operation}: ${reason}` : `Failed to ${operation}`,
  //   );
  // }
}
