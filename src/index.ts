import './models/associations';
import app from './app';
import { config } from './config/config';
import logger from './utils/logger';
import { initializeDatabase } from './config/database';

const port = config.server.port;

const startServer = async () => {
  try {
    // Initialize database and sync models
    await initializeDatabase();

    // Start the Express server
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer(); 