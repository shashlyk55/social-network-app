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
  login(@Body() credentials: LoginDto) {}

  @Post()
  refresh(@Req() req: Request) {
    const refresh_token_id = req.cookies;
  }

  @Get('login/:provider')
  handleOAuthLogin(@Param('provider') provider: string) {}

  @Get(':provider/callback')
  handleOAuthCallback(@Param() provider: string, @Query('id') code: string) {}

  @Post('logout')
  logout(@Req() req: Request) {
    const refresh_token_id = req.cookies;
  }

  @Post('signup')
  signUp() {}
}
