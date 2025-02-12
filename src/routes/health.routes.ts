import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';
import { HealthService } from '../services';

const router = Router();
const healthService = new HealthService();
const healthController = new HealthController(healthService);

router.get('/', healthController.checkHealth);

export default router; 