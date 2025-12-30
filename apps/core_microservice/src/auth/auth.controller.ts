import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { Request } from 'express';
import { OrchestratorAuthService } from './services/orchestrator-auth.service';
import { FullRegisterDto } from './dto/full-register.dto';
import { IAuthService } from './interfaces/IAuthService';
import { IRegistrationService } from './interfaces/IOrchestratorAuthService';
import { OrchestratorAuthMapper } from './utils/orchestrator-auth.mapper';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { FullAuthResponseDto } from './dto/full-auth-response.dto';
import { AuthMapper } from './utils/auth.mapper';
import { LoginParams } from './types/auth-params.types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly registrationService: OrchestratorAuthService,
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
    const result = await this.registrationService.signup(params);

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
  refresh() {}

  @Get('login/:provider')
  handleOAuthLogin() {}

  @Get(':provider/callback')
  handleOAuthCallback() {}

  @Post('logout')
  logout() {}
}
