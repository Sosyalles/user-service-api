import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import healthRoutes from './routes/health.routes';
import path from 'path';

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? config.cors.origin
        : true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-API-KEY',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Headers'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false
};

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions));

// Increase payload size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically with appropriate headers
app.use('/uploads', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const origin = process.env.NODE_ENV === 'production'
        ? config.cors.origin
        : req.headers.origin || '*'; // Use the request's origin or '*' in development

    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-KEY');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    next();
}, express.static(path.join(__dirname, '../uploads')));

// API routes
app.use(`/api/`, routes);
app.use('/api/health', healthRoutes);

// Error handling
app.use(errorHandler);

export default app; 