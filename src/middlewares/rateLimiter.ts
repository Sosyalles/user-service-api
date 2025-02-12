import rateLimit from 'express-rate-limit';
import { config } from '../config/config';
import { TooManyRequestsError } from '../errors/AppError';

// General rate limiter for all routes
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later',
  handler: (req, res, next) => {
    next(new TooManyRequestsError('Too many requests from this IP, please try again later'));
  },
});

// Stricter rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: config.rateLimit.authWindowMs,
  max: config.rateLimit.authMax,
  message: 'Too many authentication attempts from this IP, please try again later',
  handler: (req, res, next) => {
    next(new TooManyRequestsError('Too many authentication attempts from this IP, please try again later'));
  },
}); 