import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import logger from '../utils/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  if (error instanceof AppError) {
    // Log operational errors
    if (error.isOperational) {
      logger.warn({
        message: error.message,
        stack: error.stack,
        statusCode: error.statusCode,
        path: req.path,
        method: req.method,
      });
    } else {
      // Log programming or other unhandled errors
      logger.error({
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
      });
    }

    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }

  // Handle unknown errors
  logger.error({
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}; 