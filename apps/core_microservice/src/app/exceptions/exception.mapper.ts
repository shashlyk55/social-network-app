import { HttpException, HttpStatus } from '@nestjs/common';
import { DomainException } from 'src/app/exceptions/domain.exception';
import { MicroserviceException } from 'src/internal-http/exceptions/microservice-http.exceptions';

export class ExceptionMapper {
  private static readonly statusMap: Record<string, number> = {
    // Auth / User
    USER_NOT_FOUND: HttpStatus.NOT_FOUND,
    INVALID_CREDENTIALS: HttpStatus.UNAUTHORIZED,
    USER_DISABLED: HttpStatus.FORBIDDEN,
    EMAIL_ALREADY_EXISTS: HttpStatus.CONFLICT,

    // Posts
    POST_NOT_FOUND: HttpStatus.NOT_FOUND,
    POST_ALREADY_LIKED: HttpStatus.CONFLICT,

    // Chats
    CHAT_NOT_FOUND: HttpStatus.NOT_FOUND,
    ACCESS_DENIED: HttpStatus.FORBIDDEN,

    // Default
    INTERNAL_SERVER_ERROR: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  static mapToResponse(exception: unknown): {
    status: number;
    body: Record<string, any>;
  } {
    // exceptions from other microservices
    if (exception instanceof MicroserviceException) {
      return {
        status: exception.getStatus(),
        body: exception.getResponse() as Record<string, any>,
      };
    }

    // exceptions in current microservice
    if (exception instanceof DomainException) {
      return {
        status: this.statusMap[exception.code] || HttpStatus.BAD_REQUEST,
        body: {
          success: false,
          error: { code: exception.code, message: exception.message },
        },
      };
    }

    // standart nest js exceptions(http exceptions)
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const status = exception.getStatus();

      return {
        status,
        body: {
          success: false,
          error: {
            code: (response as any).code || this.getErrorCodeByStatus(status),
            message: (response as any).message || exception.message,
          },
        },
      };
    }

    if (exception instanceof DomainException) {
      const status = this.statusMap[exception.code] || HttpStatus.BAD_REQUEST;
      return {
        status: status,
        body: {
          success: false,
          error: {
            code: exception.code,
            message: exception.message,
          },
        },
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        },
      },
    };
  }

  private static getErrorCodeByStatus(status: number): string {
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}
