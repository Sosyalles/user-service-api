import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

// Internal user operations
router.get('/users/:id', userController.getUserById);
router.get('/users/username/:username', userController.getUserByUsername);
router.get('/users/email/:email', userController.getUserByEmail);
router.get('/users/list', userController.getAllUsers);

export default router; 