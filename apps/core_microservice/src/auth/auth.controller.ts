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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login() {}

  @Post('refresh')
  refresh() {}

  @Get('login/:provider')
  handleOAuthLogin() {}

  @Get(':provider/callback')
  handleOAuthCallback() {}

  @Post('logout')
  logout() {}

  @Post('signup')
  signUp() {}
}
