import { Application } from 'express';
import { DataSource } from 'typeorm';
import express from 'express';
import { createAuthRouter } from '../auth/auth.routes';
import { errorHandler } from './middleware/error-handler.middleware';
import cookieParser from 'cookie-parser';
import { createUsersRouter } from '../users/users.route';

export function configureApp(app: Application, dataSource: DataSource) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const authRouter = createAuthRouter(dataSource);
  const usersRouter = createUsersRouter(dataSource);
  app.use('/internal/auth', authRouter);
  app.use('/internal/users', usersRouter);

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
}
