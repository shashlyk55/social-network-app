import { NextFunction, Request, Response } from 'express';
import { HandleExceptions } from '../app/decorators/controller.decorator';
import { IUsersService } from './interfaces/IUsersService';

export class UsersController {
  constructor(private readonly userService: IUsersService) {}

  @HandleExceptions()
  async delete(
    req: Request<{ userId: number }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      console.log(userId);

      await this.userService.remove(userId);

      console.log('AFTER REMOVING');

      res.status(201).json({
        sucess: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
