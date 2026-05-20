import { Request, Router } from 'express';
import { AccountsService } from 'src/accounts/accounts.service';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { ExternalAuthService } from 'src/auth/external-auth.service';
import { RedisAuthRepository } from 'src/auth/redis-auth.repository';
import { Account } from 'src/entities/account.entity';
import { User } from '../entities/user.entity';
import { DataSource } from 'typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

export function createUsersRouter(dataSource: DataSource): Router {
  const router = Router();

  const usersRepository = dataSource.getRepository(User);

  const usersService = new UsersService(usersRepository, dataSource);

  const usersController = new UsersController(usersService);

  router.delete('/:userId', (req: Request<{ userId: number }>, res, next) =>
    usersController.delete(req, res, next),
  );

  return router;
}
