import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { Request } from 'express';
import { RegistrationService } from './services/registration.service';
import { FullRegisterDto } from './dto/full-register.dto';
import { IAuthService } from './interfaces/IAuthService';
import { IRegistrationService } from './interfaces/IRegistrationService';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: IAuthService,
    private readonly registrationService: IRegistrationService,
  ) {}

  @Post('signup')
  async signUp(@Body() dto: FullRegisterDto) {
    return await this.registrationService.processSignup(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.handleLogin(dto);
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
