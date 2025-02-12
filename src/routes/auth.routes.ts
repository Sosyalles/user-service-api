import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validate, userSchemas } from '../middlewares/validation';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();
const userController = new UserController();

// Public authentication routes
router.post(
  '/register',
  authLimiter,
  validate(userSchemas.register),
  userController.register
);

router.post(
  '/login',
  authLimiter,
  validate(userSchemas.login),
  userController.login
);

router.post(
  '/change-password',
  validate(userSchemas.changePassword),
  userController.changePassword
);

export default router; 