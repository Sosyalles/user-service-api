import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserDetailController } from '../controllers/UserDetailController';
import { authenticateJWT } from '../middlewares/auth';
import { generalLimiter } from '../middlewares/rateLimiter';
import { uploadProfilePhotos } from '../utils/multerConfig';

const router = Router();
const userController = new UserController();
const userDetailController = new UserDetailController();

// All profile routes require JWT authentication
router.use(authenticateJWT);
router.use(generalLimiter);

// User profile routes
router.get('/profile', userController.getProfile);
router.get('/profile/details/:username', userController.getProfileWithDetailsByUsername);
router.patch('/profile', userController.updateUser);
router.post('/profile/photos', uploadProfilePhotos, userController.updateProfilePhotos);

// User detail routes
router.get('/profile/detail', userDetailController.getUserDetail);
router.patch('/profile/detail', userDetailController.updateUserDetail);

export default router; 