import { Response } from 'express';
import { HttpExceptionMapper } from './http-exception.mapper';

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res: Response,
    error: Error,
    additionalInfo?: Record<string, any>,
  ): Response {
    const statusCode = HttpExceptionMapper.getStatusCode(error);
    const isDomainException = HttpExceptionMapper.isDomainException(error);

    const response: any = {
      success: false,
      error: {
        code: isDomainException ? (error as any).code : 'INTERNAL_ERROR',
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    };

    // Добавляем детали для доменных исключений
    if (isDomainException && additionalInfo) {
      response.error.details = additionalInfo;
    }

    // В development добавляем stack trace
    if (process.env.NODE_ENV === 'development' && !isDomainException) {
      response.error.stack = error.stack;
    }

    return res.status(statusCode).json(response);
  }

  static validationError(
    res: Response,
    errors: Record<string, string[]> | string[],
  ): Response {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
