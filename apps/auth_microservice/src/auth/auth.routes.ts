import { Router } from 'express';

import { DataSource } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountsService } from '../accounts/accounts.service';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { Account } from '../entities/account.entity';

export function createAuthRouter(dataSource: DataSource): Router {
  const router = Router();

  const userRepository = dataSource.getRepository(User);
  const accountRepository = dataSource.getRepository(Account);

  const userService = new UsersService(userRepository, dataSource);
  const accountService = new AccountsService(accountRepository, dataSource);
  const authService = new AuthService(accountService, userService, dataSource);

  const authController = new AuthController(authService);

  router.post('/register', (req, res, next) =>
    authController.register(req, res, next),
  );

  router.post('/login', (req, res, next) =>
    authController.login(req, res, next),
  );

  router.post('/validate', (req, res, next) => {});
  router.post('/refresh', (req, res, next) => {});
  router.post('/logout', (req, res, next) => {});

  return router;
}
