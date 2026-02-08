import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      refreshToken?: string;
      accessToken?: string;
    }
  }
}
