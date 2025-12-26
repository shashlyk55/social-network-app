import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import {
  LoginParams,
  RegisterParams,
  TokenDecodeResult,
  TokenPayload,
} from './types/auth-params.types';
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
      const params: RegisterParams = RegisterDto.toRegisterParams(registerDto);
      const result = await this.authService.registerUser(params);

      this.setRefreshCookie(res, result.tokens.refreshToken);

      res.status(200).json({
        sucess: true,
        data: result,
        message: 'Register successfully',
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
      const result = await this.authService.authenticateUser(params);

      this.setRefreshCookie(res, result.tokens.refreshToken);

      res.status(200).json({
        sucess: true,
        data: result,
        message: 'Login successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  @HandleExceptions()
  async validate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accessToken = req.accessToken!;

      const result = await this.authService.validateAccessToken(accessToken);

      res.status(200).json({
        sucess: true,
        data: result,
        message: 'Token validated',
      });
    } catch (error) {
      next(error);
    }
  }

  @HandleExceptions()
  async refreshTokens(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken = req.refreshToken!;
      console.log(refreshToken);

      const tokens = await this.authService.processRefreshToken(refreshToken);

      console.log(tokens);

      this.setRefreshCookie(res, tokens.refreshToken);

      res.json({
        success: true,
        data: tokens,
        message: 'Tokens updated',
      });
    } catch (error) {
      next(error);
    }
  }

  @HandleExceptions()
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accessToken = req.accessToken!;
      const refreshToken = req.refreshToken!;

      const params = { accessToken, refreshTokenId: refreshToken };

      await this.authService.logout(params);

      res.clearCookie('refreshToken');
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  private setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth/refresh',
    });
  }
}
