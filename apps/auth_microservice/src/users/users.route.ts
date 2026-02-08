import { Request, Router } from 'express';
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
