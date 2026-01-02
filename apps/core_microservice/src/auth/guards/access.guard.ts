import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let accessToken = request.headers.authorization;

    if (!accessToken) {
      throw new UnauthorizedException('Access token missing');
    }

    try {
      accessToken = accessToken.replace('Bearer ', '');

      const user = await this.authService.validateToken(accessToken);
      console.log(user.payload);

      request['user'] = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
