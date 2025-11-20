// interceptors/winston-logging.interceptor.ts (с DI)
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WinstonLoggerService } from './winston-logger.service';

@Injectable()
export class WinstonLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const now = Date.now();

    this.logger.log('Incoming Request', 'HTTP', {
      method,
      url,
      ip,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;

        this.logger.log('Outgoing Response', 'HTTP', {
          method,
          url,
          statusCode: response.statusCode,
          responseTime: `${delay}ms`,
          timestamp: new Date().toISOString(),
        });
      }),
    );
  }
}
