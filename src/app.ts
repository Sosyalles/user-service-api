import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import healthRoutes from './routes/health.routes';
import path from 'path';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use(`/api/${config.server.apiVersion}`, routes);
app.use('/api/health', healthRoutes);

// Error handling
app.use(errorHandler);

export default app; 