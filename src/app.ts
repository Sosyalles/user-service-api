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

// Increase payload size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use(`/api/`, routes);
app.use('/api/health', healthRoutes);

// Error handling
app.use(errorHandler);

export default app; 