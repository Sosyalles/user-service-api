import { Request, Response } from 'express';
import { HealthService, HealthStatus } from '../services';
import logger from '../utils/logger';

export class HealthController {
    private healthService: HealthService;

    constructor(healthService: HealthService) {
        this.healthService = healthService;
    }

    public checkHealth = async (req: Request, res: Response): Promise<void> => {
        try {
            const status = await this.healthService.checkHealth();
            res.status(200).json(status);
        } catch (error) {
            logger.error('Health check failed:', error);
            res.status(503).json({ status: 'unhealthy', message: 'Service is not available' });
        }
    };
} 