import { DomainException } from '../../common/exceptions/domain.excpetion';

export class InvalidCredentials extends DomainException {
  code = 'INVALID_CREDENTIALS';

  constructor() {
    super('Ivalid credentials');
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
