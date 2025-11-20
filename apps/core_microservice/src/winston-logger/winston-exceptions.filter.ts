import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonLoggerService } from './winston-logger.service';

@Catch()
export class WinstonExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message : (message as any).message,
    };

    const logMeta = {
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      // userId: request.user?.id || 'anonymous',
      body: this.sanitizeBody(request.body),
      query: request.query,
      params: request.params,
    };

    if (status >= 500) {
      this.logger.error(
        `Server Error: ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : 'No stack trace',
        'HTTPException',
        {
          ...logMeta,
          statusCode: status,
          error:
            exception instanceof Error ? exception.message : 'Unknown error',
        },
      );
    } else if (status >= 400) {
      this.logger.warn(
        `Client Error: ${request.method} ${request.url} - ${status}`,
        'HTTPException',
        {
          ...logMeta,
          statusCode: status,
          error:
            exception instanceof Error ? exception.message : 'Unknown error',
        },
      );
    } else {
      this.logger.error(
        `Exception: ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : 'No stack trace',
        'HTTPException',
        {
          ...logMeta,
          statusCode: status,
          error:
            exception instanceof Error ? exception.message : 'Unknown error',
        },
      );
    }

    response.status(status).json(errorResponse);
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sanitized = { ...body };
    const sensitiveFields = [
      'password',
      'token',
      'refreshToken',
      'accessToken',
      'secret',
      'apiKey',
    ];

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}
