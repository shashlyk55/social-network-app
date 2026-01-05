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
import { ConfigService } from 'src/config/config.service';

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

  // router.use(passport.initialize());

  router.get('/login/:provider', (req, res, next) =>
    authController.loginWithOAuthProvider(req, res, next),
  );

  router.get('/callback/:provider', (req, res, next) =>
    authController.handleCallback(req, res, next),
  );

  router.post('/register', (req, res, next) =>
    authController.register(req, res, next),
  );

  router.post('/login', (req, res, next) =>
    authController.login(req, res, next),
  );

  router.post('/validate', extractAccessToken, (req, res, next) =>
    authController.validate(req, res, next),
  );

  router.post('/refresh', extractRefreshToken, (req, res, next) =>
    authController.refreshTokens(req, res, next),
  );

  router.post(
    '/logout',
    extractAccessToken,
    extractRefreshToken,
    (req, res, next) => authController.logout(req, res, next),
  );

  return router;
}
