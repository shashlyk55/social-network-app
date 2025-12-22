import { Request, Response, NextFunction } from 'express';
import { HttpExceptionMapper } from '../utils/http-exception.mapper';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Логирование ошибки
  logError(error, req);

  // Маппинг через маппер
  HttpExceptionMapper.mapToHttpResponse(error, res);
};

// Дополнительная middleware для логирования
export const domainErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (HttpExceptionMapper.isDomainException(error)) {
    req.app.locals.lastDomainError = error;
  }
  next(error);
};

function logError(error: Error, req: Request): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    },
    user: (req as any).user?.id || 'anonymous',
    ip: req.ip,
  };

  if (process.env.NODE_ENV === 'production') {
    console.error(JSON.stringify(logEntry));
  } else {
    console.error('\n=== ERROR ===');
    console.error(`Path: ${req.method} ${req.url}`);
    console.error(`Error: ${error.name}: ${error.message}`);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    console.error('=============\n');
  }
}
