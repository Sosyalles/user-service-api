import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateApiKey } from '../middlewares/auth';
import { generalLimiter } from '../middlewares/rateLimiter';

const router = Router();
const userController = new UserController();

// All admin routes require API key authentication
router.use(authenticateApiKey);
router.use(generalLimiter);

// Admin routes
router.get('/users', userController.getAllUsers);

export default router; 