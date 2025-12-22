import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  UserNotFoundException,
  EmailAlreadyExistsException,
  UsernameAlreadyExistsException,
  UserOperationException,
} from '../../users/exceptions/user.exceptions';
import { DomainException } from '../../common/exceptions/domain.excpetion';

export class ExceptionMapper {
  static mapDomainToHttp(domainException: DomainException): HttpException {
    // Users domain
    if (domainException instanceof UserNotFoundException) {
      return new NotFoundException(domainException.message);
    }

    if (domainException instanceof EmailAlreadyExistsException) {
      return new ConflictException(domainException.message);
    }

    if (
      domainException instanceof EmailAlreadyExistsException ||
      domainException instanceof UsernameAlreadyExistsException
    ) {
      return new ConflictException(domainException.message);
    }

    if (domainException instanceof UserOperationException) {
      return new InternalServerErrorException(domainException.message);
    }

    return new BadRequestException(domainException.message);
  }
}
