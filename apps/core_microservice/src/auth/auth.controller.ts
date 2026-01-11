import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { Request, Response } from 'express';
import { OrchestratorAuthService } from './services/orchestrator-auth.service';
import { FullRegisterDto } from './dto/full-register.dto';
import { OrchestratorAuthMapper } from './utils/orchestrator-auth.mapper';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FullAuthResponseDto } from './dto/full-auth-response.dto';
import {
  AccountProviderType,
  LoginParams,
  OAuthCallbackParams,
} from './types/auth-params.types';
import { AccessGuard } from './guards/access.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly orchestartorAuthService: OrchestratorAuthService,
  ) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Регистрация нового пользователя и создание профиля',
  })
  @ApiBody({ type: FullRegisterDto })
  @ApiResponse({
    status: 201,
    description:
      'Пользователь успешно создан, возвращены токены и данные профиля',
    type: FullAuthResponseDto,
  })
  @ApiConflictResponse({ description: 'Username или Email уже заняты' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации входных данных' })
  async signUp(@Body() dto: FullRegisterDto) {
    const params = OrchestratorAuthMapper.toSignupParams(dto);
    const result = await this.orchestartorAuthService.signup(params);

    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Авторизация пользователя (Local Provider)' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    type: FullAuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() dto: LoginDto) {
    const params = dto as LoginParams;

    return await this.authService.handleLogin(params);
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'] || null;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result =
      await this.orchestartorAuthService.refreshToken(refreshToken);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return OrchestratorAuthMapper.toResponseDto(result);
  }

  @Get('login/:provider')
  async handleOAuthLogin(
    @Param('provider') provider: AccountProviderType,
    @Res() res: Response,
  ) {
    const { url: authUrl } =
      await this.orchestartorAuthService.handleOAuthInit(provider);

    return res.redirect(authUrl);
  }

  @Get(':provider/callback')
  async handleOAuthCallback(
    @Param('provider') provider: AccountProviderType,
    @Query('code') code: string,
    @Query('error') error: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // if (error) {
    //   return res.redirect(`${process.env.FRONTEND_URL}/login?error=${error}`);
    // }

    try {
      const params: OAuthCallbackParams = {
        authorizationCode: code,
        provider,
        error,
      };
      const result =
        await this.orchestartorAuthService.handleOAuthCallback(params);

      console.log(result);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/auth/refresh',
      });

      const frontendUrl = `${process.env.FRONTEND_URL}/auth/success?token=${result.accessToken}`;
      return res.redirect(frontendUrl);
    } catch (error) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
      );
    }
  }

  @Post('logout')
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  @ApiOperation({
    summary: 'Выход из системы (инвалидация токена и очистка кук)',
  })
  @ApiResponse({ status: 201, description: 'Успешный выход' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    let accessToken = req.headers.authorization;

    if (refreshToken && accessToken) {
      accessToken = accessToken.replace('Bearer ', '');
      await this.orchestartorAuthService.logout({
        refreshToken: refreshToken,
        accessToken,
      });
    }

    res.status(201).clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    return { message: 'Logged out successfully' };
  }
}
