import { Application, NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import express from 'express';
import { createAuthRouter } from '../auth/auth.routes';
import {
  domainErrorHandler,
  errorHandler,
} from './middleware/error-handler.middleware';

export function configureApp(app: Application, dataSource: DataSource) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const authRouter = createAuthRouter(dataSource);
  app.use('/internal/auth', authRouter);

  // global error handlers (order is important)
  app.use(domainErrorHandler);
  app.use(errorHandler);
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.url} not found`,
      },
    });
  });

  // app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  //   // console.error(err.stack);
  //   res.status(500).send('Internal server error');
  // });
}
