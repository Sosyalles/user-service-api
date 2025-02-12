import { testConnection } from '../config/database';
import logger from '../utils/logger';

export interface HealthStatus {
    status: 'healthy' | 'unhealthy';
    details?: {
        database: boolean;
        timestamp: string;
    };
}

export class HealthService {
    public async checkHealth(): Promise<HealthStatus> {
        try {
            await testConnection();
            return {
                status: 'healthy',
                details: {
                    database: true,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            logger.error('Database health check failed:', error);
            return {
                status: 'unhealthy',
                details: {
                    database: false,
                    timestamp: new Date().toISOString()
                }
            };
        }
    }
} 