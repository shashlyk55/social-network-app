// filters/global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionMapper } from 'src/app/exceptions/exception.mapper';
import { DomainException } from './domain.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpException: HttpException;

    if (exception instanceof DomainException) {
      // Маппим доменное исключение в HTTP
      httpException = ExceptionMapper.mapDomainToHttp(exception);
    } else if (exception instanceof HttpException) {
      // Уже HTTP исключение
      httpException = exception;
    } else if (exception instanceof Error) {
      // Неизвестная ошибка
      this.logger.error(
        `Unhandled error: ${exception.message}`,
        exception.stack,
      );
      httpException = new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      // Неизвестный тип ошибки
      httpException = new HttpException(
        'Unknown error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    response.status(httpException.getStatus()).json({
      success: false,
      error: {
        //code: httpException.code,
        message: httpException.message,
        //details: httpException.details,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
