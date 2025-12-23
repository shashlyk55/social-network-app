import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginParams, RegisterParams } from './types/auth-params.types';
import {
  AsyncController,
  HandleExceptions,
} from '../app/decorators/controller.decorator';
import { IAuthService } from './interfaces/IAuthService';
import { LoginDto } from './dto/login-dto';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  @HandleExceptions()
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const registerDto: RegisterDto = req.body;
      const createdById = registerDto.createdById;

      const params: RegisterParams = RegisterDto.toRegisterParams(registerDto);

      const result = await this.authService.registerUser(params);

      res.status(201).json({
        sucess: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  @HandleExceptions()
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginDto: LoginDto = req.body;
      const params: LoginParams = LoginDto.toLoginParams(loginDto);

      const result = await this.authService.authenticateUser(loginDto);

      res.status(201).json({
        sucess: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  @HandleExceptions()
  async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
    


    }catch(error){
      next(error)
    }
  }

  @HandleExceptions()
  async refreshTokens(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{


      
    }catch(error){
      next(error)
    }
  }
}
