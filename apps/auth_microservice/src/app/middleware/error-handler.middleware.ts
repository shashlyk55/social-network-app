import { Request, Response, NextFunction } from 'express';
import { HttpExceptionMapper } from '../utils/http-exception.mapper';
import { InfrastructureException } from '../../common/exceptions/infrastructure.exception';
import { DomainException } from '../../common/exceptions/domain.exception';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logError(error, req);

  HttpExceptionMapper.mapToHttpResponse(error, res);
};

function logError(error: Error, req: Request): void {
  const internalDetails =
    error instanceof InfrastructureException ? error.rawError : null;
  const errorCode = (error as any).code || 'INTERNAL_ERROR';

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
    console.error('\n=== [ERROR LOG] ===');
    console.error(`Status: ${req.method} ${req.url}`);
    console.error(`Code:   ${errorCode}`);
    console.error(`Msg:    ${error.message}`);

    if (internalDetails) {
      console.error('--- Internal Details ---');
      console.dir(internalDetails, { depth: null });
    }

    if (error.stack && !(error instanceof DomainException)) {
      console.error('--- Stack Trace ---');
      console.error(error.stack);
    }
    console.error('====================\n');
  }
}
