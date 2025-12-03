// mappers/exception.mapper.ts
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
import {
  CommentAccessDeniedException,
  CommentWithRepliesException,
  DomainException,
  ParentCommentNotFoundException,
  ProfileNotFoundException,
} from 'src/app/exceptions/domain.exception';
import { PostAlreadyLikedException } from 'src/posts/exceptions/post-domain.exceptions';
import {
  ChatParticipantNotFoundException,
  ChatParticipantAlreadyExistsException,
  InsufficientParticipantsException,
  ChatValidationException,
  InvalidChatTypeException,
  ChatParticipantRoleException,
} from 'src/chats/exceptions/chat-domain.exceptions';

export class ExceptionMapper {
  static mapDomainToHttp(domainException: DomainException): HttpException {
    // Users domain
    if (
      domainException instanceof UserNotFoundException ||
      domainException instanceof ProfileNotFoundException
    ) {
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

    // Post domain
    if (domainException instanceof NotFoundException) {
      return new NotFoundException(domainException.message);
    }

    if (domainException instanceof PostAlreadyLikedException) {
      return new ConflictException(domainException.message);
    }

    if (domainException instanceof UserOperationException) {
      return new InternalServerErrorException(domainException.message);
    }

    // Comment domain
    if (
      domainException instanceof ParentCommentNotFoundException ||
      domainException instanceof ParentCommentNotFoundException
    ) {
      return new NotFoundException(domainException.message);
    }

    if (
      domainException instanceof CommentWithRepliesException ||
      domainException instanceof PostAlreadyLikedException
    ) {
      return new ConflictException(domainException.message);
    }

    if (domainException instanceof UserOperationException) {
      return new InternalServerErrorException(domainException.message);
    }

    // Chat domain
    if (
      domainException instanceof NotFoundException ||
      domainException instanceof ChatParticipantNotFoundException
    ) {
      return new NotFoundException(domainException.message);
    }

    if (
      domainException instanceof EmailAlreadyExistsException ||
      domainException instanceof ChatParticipantAlreadyExistsException ||
      domainException instanceof InsufficientParticipantsException
    ) {
      return new ConflictException(domainException.message);
    }

    if (
      domainException instanceof CommentAccessDeniedException ||
      domainException instanceof ChatParticipantRoleException
    ) {
      return new ForbiddenException(domainException.message);
    }

    if (domainException instanceof UserOperationException) {
      return new InternalServerErrorException(domainException.message);
    }

    return new BadRequestException(domainException.message);
  }
}
