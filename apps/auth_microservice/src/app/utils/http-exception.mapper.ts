import { Response } from 'express';
import { DomainException } from '../../common/exceptions/domain.exception';

const ErrorCodeToHttpStatus: Record<string, number> = {
  ACCOUNT_NOT_FOUND: 404,
  USER_NOT_FOUND: 404,
  PROFILE_NOT_FOUND: 404,
  SESSION_NOT_FOUND: 404,
  EMAIL_ALREADY_EXISTS: 409,
  INVALID_CREDENTIALS: 401,
  INVALID_TOKEN: 401,
  ACCESS_TOKEN_IN_BLACKLIST: 401,
  REFRESH_TOKEN_IN_BLACKLIST: 401,
  USER_DISABLED: 403,
  TOKEN_EXPIRED: 403,
  INVALID_TOKEN_SIGNATURE: 403,
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
}
