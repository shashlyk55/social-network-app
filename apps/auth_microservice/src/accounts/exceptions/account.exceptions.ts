import { DomainException } from '../../common/exceptions/domain.excpetion';

export class AccountNotFoundException extends DomainException {
  code = 'ACCOUNT_NOT_FOUND';

  constructor(accountId?: string | number) {
    super(
      accountId
        ? `Account with id ${accountId} not found`
        : `Account not found`,
    );
  }
}

export class EmailAlreadyExistsException extends DomainException {
  code = 'EMAIL_ALREADY_EXISTS';

  constructor(email: string) {
    super(`Email "${email}" is already registered`);
  }
}

export class AccountOperationException extends DomainException {
  code = 'ACCOUNT_OPERATION_FAILED';

  constructor(operation: string, reason?: string) {
    super(
      reason ? `Failed to ${operation}: ${reason}` : `Failed to ${operation}`,
    );
  }
}
