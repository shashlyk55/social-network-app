import { DomainException } from 'src/app/exceptions/domain.exception';

export class FollowToYourself extends DomainException {
  code = 'FOLLOW_TO_YOURSELF';
  constructor() {
    super('User cannot follow to yourself');
  }
}

export class UserAlreadyFollowed extends DomainException {
  code = 'USER_ALREADY_FOLLOWED';
  constructor() {
    super('User already followed');
  }
}

export class UserNotFollowed extends DomainException {
  code = 'USER_NOT_FOLLOWED';
  constructor() {
    super('User not followed');
  }
}
