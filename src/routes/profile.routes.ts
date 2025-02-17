import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserDetailController } from '../controllers/UserDetailController';
import { authenticateJWT } from '../middlewares/auth';
import { generalLimiter } from '../middlewares/rateLimiter';
import { uploadProfilePhotos } from '../utils/multerConfig';

const router = Router();
const userController = new UserController();
const userDetailController = new UserDetailController();

// The following route is public and does not require JWT authentication
router.get('/profile/details/:username', userController.getProfileWithDetailsByUsername);


router.use(authenticateJWT);
router.use(generalLimiter);

// User profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateUser);

// Profile photos
router.post('/profile/photos', uploadProfilePhotos, userDetailController.uploadProfilePhotos);
router.delete('/profile/photos', authenticateJWT, userDetailController.deleteProfilePhotos);

// User detail routes
router.get('/profile/detail', userDetailController.getUserDetail);
router.patch('/profile/detail', userDetailController.updateUserDetail);

export default router; 