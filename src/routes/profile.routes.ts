import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateJWT } from '../middlewares/auth';
import { validate, userSchemas } from '../middlewares/validation';
import { generalLimiter } from '../middlewares/rateLimiter';

const router = Router();
const userController = new UserController();

// All profile routes require JWT authentication
router.use(authenticateJWT);
router.use(generalLimiter);

// Profile routes
router.get('/', userController.getProfile);

router.patch(
  '/',
  validate(userSchemas.update),
  userController.updateUser
);

router.delete('/', userController.deleteUser);

export default router; 