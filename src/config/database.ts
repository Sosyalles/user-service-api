import { Sequelize, DataTypes } from 'sequelize';
import { config } from './config';
import logger from '../utils/logger';

export const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    dialect: 'postgres',
    logging: (msg: string) => logger.debug(msg),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Initialize database and sync models
export const initializeDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');

    await sequelize.sync({ alter: true });
    logger.info('All models synchronized successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
};

export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    throw new Error('Unable to connect to the database');
  }
};

export { DataTypes }; 