import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import internalRoutes from './internal.routes';
import { authenticateApiKey } from '../middlewares/auth';

const router = Router();

// Public routes
router.use('/auth', authRoutes);
router.use('/users', profileRoutes);

// Internal routes (protected by API key)
router.use('/internal', authenticateApiKey, internalRoutes);

export default router; 