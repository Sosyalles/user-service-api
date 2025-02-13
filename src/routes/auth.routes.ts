import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validate, userSchemas } from '../middlewares/validation';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();
const userController = new UserController();

// Apply rate limiting to auth routes
router.use(authLimiter);

// Auth routes
router.post('/register', validate(userSchemas.register), userController.register);
router.post('/login', validate(userSchemas.login), userController.login);
router.post('/change-password', validate(userSchemas.changePassword), userController.changePassword);

export default router; 