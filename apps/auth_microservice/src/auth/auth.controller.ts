import { NextFunction, Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import {
  LoginParams,
  OAuthResult,
  RegisterParams,
} from './types/auth-params.types';
import { HandleExceptions } from '../app/decorators/controller.decorator';
import { IAuthService } from './interfaces/IAuthService';
import { LoginDto } from './dto/login-dto';
import { AccountProviderType } from '../entities/account.entity';
import { AuthResponseDto } from './dto/auth-response.dto';
import { OAuthResponseDto } from './dto/oauth-response.dto';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  @HandleExceptions
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const registerDto: RegisterDto = req.body;
    const params: RegisterParams = RegisterDto.toRegisterParams(registerDto);
    const result = await this.authService.registerUser(params);

    const response: AuthResponseDto = AuthResponseDto.toResponse(result);

    res.status(200).json({
      sucess: true,
      data: response,
      message: 'Register successfully',
    });
  }

  @HandleExceptions
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const loginDto: LoginDto = req.body;
    const params: LoginParams = LoginDto.toLoginParams(loginDto);
    const result = await this.authService.authenticateUser(params);

    const response: AuthResponseDto = AuthResponseDto.toResponse(result);

    res.status(200).json({
      sucess: true,
      data: response,
      message: 'Login successfully',
    });
  }

  @HandleExceptions
  async validate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const accessToken = req.accessToken!;

    const result = await this.authService.validateAccessToken(accessToken);

    res.status(200).json({
      sucess: true,
      data: result,
      message: 'Token validated',
    });
  }

  @HandleExceptions
  async refreshTokens(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const refreshToken = req.refreshToken!;

    const result = await this.authService.processRefreshToken(refreshToken);

    const response: AuthResponseDto = AuthResponseDto.toResponse(result);

    res.status(200).json({
      success: true,
      data: response,
      message: 'Tokens updated',
    });
  }

  @HandleExceptions
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    const accessToken = req.accessToken!;
    const refreshToken = req.refreshToken!;

    const params = { accessToken, refreshTokenId: refreshToken };

    await this.authService.logout(params);

    res.status(201).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  @HandleExceptions
  async loginWithOAuthProvider(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<unknown> {
    const { provider } = req.params as { provider: AccountProviderType };

    if (
      !Object.values(AccountProviderType).includes(provider) ||
      provider === AccountProviderType.LOCAL
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or unsupported provider',
      });
    }

    const redirectUrl = this.authService.getOAuthRedirectUrl(provider);

    //return res.redirect(redirectUrl);

    return res.status(200).json({
      success: true,
      data: { url: redirectUrl },
    });
  }

  @HandleExceptions
  async handleCallback(req: Request, res: Response, next: NextFunction) {
    const { provider } = req.params as { provider: AccountProviderType };
    const { code, error } = req.query;

    if (error) {
      return res.status(400).json({
        success: false,
        error,
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is missing',
      });
    }

    const authResult: OAuthResult = await this.authService.exchageCodeForTokens(
      code as string,
      provider,
    );

    // const data = {
    //   user: authResult.user,
    //   //account: authResult.account,
    //   externalProfile: authResult.externalProfile,
    //   tokens: authResult.tokens,
    // };

    const response = OAuthResponseDto.toResponse(authResult);

    return res.status(200).json({
      success: true,
      data: response,
      message: 'Login successfully',
    });
  }
}
