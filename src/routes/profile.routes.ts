import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateJWT } from '../middlewares/auth';
import { validate, userSchemas } from '../middlewares/validation';
import { generalLimiter } from '../middlewares/rateLimiter';
import { uploadProfilePhotos } from '../utils/multerConfig';

const router = Router();
const userController = new UserController();

// All profile routes require JWT authentication
router.use(authenticateJWT);
router.use(generalLimiter);

// Profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', validate(userSchemas.update), userController.updateUser);
router.post('/profile/photos', uploadProfilePhotos, userController.updateProfilePhotos);
router.delete('/:id', userController.deleteUser);

export default router; 