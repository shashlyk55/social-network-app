import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    //let accessToken = request.headers.authorization;
    let accessToken = request.cookies['accessToken'];

    if (!accessToken) {
      throw new UnauthorizedException('Access token missing');
    }

    try {
      accessToken = accessToken.replace('Bearer ', '');

      const authData = await this.authService.validateToken(accessToken);

      request['user'] = authData.payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
