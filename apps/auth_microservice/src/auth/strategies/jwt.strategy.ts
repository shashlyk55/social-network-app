import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { IRedisRepository } from '../interfaces/IRedisRepository';
import passport from 'passport';
import { TokenPayload } from '../types/auth-params.types';
import { IAuthService } from '../interfaces/IAuthService';

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET!,
  ignoreExpiration: false,
};

export const ConfigureJwtStrategy = (
  authService: IAuthService,
  redisRepository: IRedisRepository,
) => {
  passport.use(
    new Strategy(jwtOptions, async (payload: TokenPayload, done: Function) => {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(this);

      if (!token) {
        return done(null, false, { message: 'Token not found' });
      }

      // TODO: check token blacklist in Redis
      const isBlacklisted = await redisRepository.isTokenBlacklisted(token);

      if (isBlacklisted) {
        done(null, false, { message: 'Token blacklisted' });
      }

      // TODO: check user blocked and validating token
    }),
  );
};
