import { Request, Response, NextFunction } from 'express';
import { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  ForbiddenError, 
  NotFoundError, 
  ConflictError, 
  TooManyRequestsError, 
  InternalServerError 
} from '../errors/AppError';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error(`Error occurred: ${err.message}`, {
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    user: req.user?.id
  });

  // Handle specific error types
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
    return;
  }

  // Handle other unexpected errors
  const status = 500;
  const message = 'Beklenmeyen bir hata oluştu';

  res.status(status).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}; 