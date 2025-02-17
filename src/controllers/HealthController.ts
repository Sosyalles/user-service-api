import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../config/database';
import logger from '../utils/logger';
import { 
  InternalServerError 
} from '../errors/AppError';

export class HealthController {
  public healthCheck = async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ): Promise<void> => {
    try {
      // Check database connection
      await sequelize.authenticate();

      logger.info('Sağlık kontrolü başarılı');
      res.json({
        status: 'success',
        message: 'Servis sağlıklı ve çalışıyor',
        data: {
          database: 'Bağlantı başarılı',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Sağlık kontrolü başarısız:', error);
      throw new InternalServerError('Veritabanı bağlantısı kurulamadı');
    }
  };
} 