import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { AuthenticationError, AuthorizationError } from '../errors/AppError';
import { UserService } from '../services/UserService';
import logger from '../utils/logger';

interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}

const userService = new UserService();

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AuthenticationError('Authorization header is missing');
    }

    // Validate Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Invalid token format. Use Bearer token');
    }

    // Extract and verify token
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AuthenticationError('Token is missing');
    }

    try {
      // Verify and decode token
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      // Validate decoded token structure
      if (!decoded || typeof decoded !== 'object') {
        throw new AuthenticationError('Invalid token structure');
      }

      // Check for required claims
      if (!decoded.userId || typeof decoded.userId !== 'number') {
        throw new AuthenticationError('Invalid token payload');
      }

      // Check token expiration explicitly
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        throw new AuthenticationError('Token has expired');
      }

      // Verify user exists and is active
      const user = await userService.getUser(decoded.userId);
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      if (!user.isActive) {
        throw new AuthenticationError('User account is deactivated');
      }

      // Add user to request object
      req.user = { id: decoded.userId };
      
      logger.debug(`Authenticated user ID: ${decoded.userId}`);
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        if (error instanceof jwt.TokenExpiredError) {
          throw new AuthenticationError('Token has expired');
        }
        if (error instanceof jwt.NotBeforeError) {
          throw new AuthenticationError('Token not yet valid');
        }
        throw new AuthenticationError('Invalid token');
      }
      throw error;
    }
  } catch (error) {
    logger.error('Authentication error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    next(error);
  }
};

export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const apiKey = req.headers['x-api-key'];

    // Check if API key exists
    if (!apiKey) {
      throw new AuthorizationError('X-API-KEY header is missing');
    }

    // Compare with configured API key
    if (apiKey !== config.apiKey.key) {
      logger.warn('Invalid API key attempt', {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });
      throw new AuthorizationError('Invalid API key');
    }

    logger.debug('API key authentication successful');
    next();
  } catch (error) {
    logger.error('API key authentication error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
    next(error);
  }
}; 