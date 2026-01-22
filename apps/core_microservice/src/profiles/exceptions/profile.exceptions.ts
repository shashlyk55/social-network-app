import { DomainException } from '../../app/exceptions/domain.exception';

export class ProfileNotFoundException extends DomainException {
  code = 'PROFILE_NOT_FOUND';
  constructor(id?: number) {
    super(id ? `Profile with ID ${id} not found` : `Profile not found`);
  }
}

export class UsernameAlreadyExistsException extends DomainException {
  code = 'USERNAME_ALREADY_EXISTS';
  constructor(username: string) {
    super(`Username "${username}" is already taken`);
  }
}

export class PrivateProfileException extends DomainException {
  code = 'PRIVATE_PROFILE';
  constructor(profileId?: number) {
    super(
      profileId
        ? `Profile with id ${profileId} is private`
        : 'Profile is private',
    );
  }
}

export class ProfileOperationException extends DomainException {
  code = 'PROFILE_OPERATION_FAILED';
  constructor(operation: string, reason?: string) {
    super(
      reason ? `Failed to ${operation}: ${reason}` : `Failed to ${operation}`,
    );
  }
}
