import { Request, Response, NextFunction } from 'express';

export const extractAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCESS_TOKEN_REQUIRED',
          message: 'Authorization header is missing',
        },
      });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_AUTH_FORMAT',
          message: 'Format should be "Bearer <token>"',
        },
      });
    }

    req.accessToken = token;

    next();
  } catch (error) {
    console.error('Error extracting access token:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to extract access token',
      },
    });
  }
};

export const extractRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'REFRESH_TOKEN_REQUIRED',
          message: 'Refresh token cookie is required',
        },
      });
    }

    if (typeof refreshToken !== 'string' || refreshToken.trim() === '') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN_FORMAT',
          message: 'Refresh token must be a non-empty string',
        },
      });
    }

    req.refreshToken = refreshToken;

    next();
  } catch (error) {
    console.error('Error extracting refresh token:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to extract refresh token',
      },
    });
  }
};

declare global {
  namespace Express {
    interface Request {
      refreshToken?: string;
      accessToken?: string;
    }
  }
}
