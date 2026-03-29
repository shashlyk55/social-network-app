import { Router } from 'express';

import { DataSource } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountsService } from '../accounts/accounts.service';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { Account } from '../entities/account.entity';
import { RedisAuthRepository } from './redis-auth.repository';
import {
  extractAccessToken,
  extractRefreshToken,
} from './middleware/extractTokens.middleware';
import { ExternalAuthService } from './external-auth.service';
import { ConfigService } from '../config/config.service';

export function createAuthRouter(dataSource: DataSource): Router {
  const router = Router();

  const configService = new ConfigService();
  const userRepository = dataSource.getRepository(User);
  const accountRepository = dataSource.getRepository(Account);
  const redisAuthRepository = new RedisAuthRepository(configService);

  const userService = new UsersService(userRepository, dataSource);
  const accountService = new AccountsService(accountRepository, configService);
  const externalAuthService = new ExternalAuthService(configService);
  const authService = new AuthService(
    accountService,
    userService,
    dataSource,
    redisAuthRepository,
    externalAuthService,
    configService,
  );

  const authController = new AuthController(authService);

  router.get(
    '/login/:provider',
    authController.loginWithOAuthProvider.bind(authController),
  );

  router.get(
    '/callback/:provider',
    authController.handleCallback.bind(authController),
  );

  router.post('/register', authController.register.bind(authController));

  router.post('/login', authController.login.bind(authController));

  router.post(
    '/validate',
    extractAccessToken,
    authController.validate.bind(authController),
  );

  router.post(
    '/refresh',
    extractRefreshToken,
    authController.refreshTokens.bind(authController),
  );

  router.post(
    '/logout',
    extractAccessToken,
    extractRefreshToken,
    authController.logout.bind(authController),
  );

  return router;
}
