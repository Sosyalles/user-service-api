import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';
import { HealthService } from '../services';

const router = Router();
const healthController = new HealthController();

router.get('/', healthController.healthCheck);

export default router; 