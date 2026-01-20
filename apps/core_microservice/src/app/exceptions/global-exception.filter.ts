import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionMapper } from 'src/app/exceptions/exception.mapper';
import { DomainException } from './domain.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, data } = ExceptionMapper.mapToResponse(exception);

    this.logError(exception, request, status);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        exception instanceof Error ? exception.stack : exception,
      );
    }

    response.status(status).json({
      ...data,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private logError(error: any, req: Request, status: number): void {
    const errorCode =
      error?.code ||
      (error?.getResponse
        ? (error.getResponse() as any).code
        : 'INTERNAL_ERROR');

    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status,
      error: {
        name: error?.name || 'Error',
        message: error?.message || 'Unknown error',
        stack:
          process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      },
      user: (req as any).user?.id || 'anonymous',
      ip: req.ip,
    };

    if (process.env.NODE_ENV === 'production') {
      // В продакшене только JSON одной строкой для систем сбора логов
      if (status >= 500) this.logger.error(JSON.stringify(logEntry));
      else this.logger.warn(JSON.stringify(logEntry));
    } else {
      // Красивый вывод в консоль для разработки, как в твоем примере
      console.error('\n=== [ERROR LOG] ===');
      console.error(`Status: [${status}] ${req.method} ${req.url}`);
      console.error(`Code:   ${errorCode}`);
      console.error(`Msg:    ${error.message}`);

      if (error.stack && !(error instanceof DomainException)) {
        console.error('--- Stack Trace ---');
        console.error(error.stack);
      }
      console.error('====================\n');
    }
  }
}
