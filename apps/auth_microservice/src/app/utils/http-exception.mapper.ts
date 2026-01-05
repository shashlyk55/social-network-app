import { Response } from 'express';
import {
  AccountNotFoundException,
  EmailAlreadyExistsException,
  AccountOperationException,
} from '../../accounts/exceptions/account.exceptions';
import { AuthOperationException } from '../../auth/exceptions/auth.exceptions';
import { DomainException } from '../../common/exceptions/domain.exception';
import {
  UserNotFoundException,
  ProfileNotFoundException,
  UsernameAlreadyExistsException,
  UserOperationException,
} from '../../users/exceptions/user.exceptions';

const ErrorCodeToHttpStatus: Record<string, number> = {
  ACCOUNT_NOT_FOUND: 404,
  USER_NOT_FOUND: 404,
  PROFILE_NOT_FOUND: 404,
  EMAIL_ALREADY_EXISTS: 409,
  INVALID_CREDENTIALS: 401,
  INVALID_TOKEN: 401,
  ACCESS_TOKEN_IN_BLACKLIST: 401,
  REFRESH_TOKEN_IN_BLACKLIST: 401,
  USER_DISABLED: 403,
  AUTH_OPERATION_FAILED: 400,
  AUTH_OPERATION_EXCEPTION: 500,
  USER_OPERATION_EXCEPTION: 500,
};

export class HttpExceptionMapper {
  static mapToHttpResponse(error: Error, res: Response): void {
    if (error instanceof DomainException) {
      const statusCode = ErrorCodeToHttpStatus[error.code] || 400;

      res.status(statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' },
    });
  }

  /**
   * Маппит конкретные доменные исключения
   */
  private static mapDomainException(exception: DomainException): {
    statusCode: number;
    body: any;
  } {
    // Not Found исключения → 404
    if (
      exception instanceof AccountNotFoundException ||
      exception instanceof UserNotFoundException ||
      exception instanceof ProfileNotFoundException
    ) {
      return {
        statusCode: 404,
        body: {
          success: false,
          error: {
            code: exception.code,
            message: exception.message,
          },
        },
      };
    }

    // Конфликт/уже существует → 409
    if (
      exception instanceof EmailAlreadyExistsException ||
      exception instanceof UsernameAlreadyExistsException
    ) {
      return {
        statusCode: 409,
        body: {
          success: false,
          error: {
            code: exception.code,
            message: exception.message,
          },
        },
      };
    }

    // Ошибки операций (валидация, бизнес-логика) → 400
    if (
      exception instanceof AccountOperationException ||
      exception instanceof AuthOperationException ||
      exception instanceof UserOperationException
    ) {
      return {
        statusCode: 400,
        body: {
          success: false,
          error: {
            code: exception.code,
            message: exception.message,
          },
        },
      };
    }

    // Остальные доменные исключения → 400
    return {
      statusCode: 400,
      body: {
        success: false,
        error: {
          code: exception.code,
          message: exception.message,
        },
      },
    };
  }

  /**
   * Проверяет, является ли ошибка доменным исключением
   */
  static isDomainException(error: any): error is DomainException {
    return error instanceof DomainException;
  }

  /**
   * Получает HTTP статус код для исключения
   */
  static getStatusCode(error: Error): number {
    if (!(error instanceof DomainException)) {
      return 500;
    }

    if (
      error instanceof AccountNotFoundException ||
      error instanceof UserNotFoundException ||
      error instanceof ProfileNotFoundException
    ) {
      return 404;
    }

    if (
      error instanceof EmailAlreadyExistsException ||
      error instanceof UsernameAlreadyExistsException
    ) {
      return 409;
    }

    if (
      error instanceof AccountOperationException ||
      error instanceof AuthOperationException ||
      error instanceof UserOperationException
    ) {
      return 400;
    }

    return 400;
  }
}
