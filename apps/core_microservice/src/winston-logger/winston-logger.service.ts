// logger/winston-logger.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class WinstonLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  log(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, ...meta });
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, { context, trace, ...meta });
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, { context, ...meta });
  }

  debug(message: string, context?: string, meta?: any) {
    this.logger.debug(message, { context, ...meta });
  }

  verbose(message: string, context?: string, meta?: any) {
    this.logger.verbose(message, { context, ...meta });
  }

  // Метод для HTTP запросов
  httpRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    meta?: any,
  ) {
    this.logger.info(`${method} ${url} ${statusCode} - ${responseTime}ms`, {
      context: 'HTTP',
      method,
      url,
      statusCode,
      responseTime,
      ...meta,
    });
  }

  // Метод для ошибок
  exception(error: Error, context: string, meta?: any) {
    this.logger.error(error.message, {
      context,
      stack: error.stack,
      ...meta,
    });
  }
}
