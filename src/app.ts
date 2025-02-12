import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './config/swagger';
import healthRoutes from './routes/health.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(`/api/${config.server.apiVersion}`, routes);
app.use('/api/health', healthRoutes);

// Error handling
app.use(errorHandler);

// Setup Swagger only in development environment
if (config.server.nodeEnv === 'development') {
  setupSwagger(app);
}

export default app; 