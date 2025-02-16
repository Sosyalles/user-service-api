import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const config = {
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    apiVersion: process.env.API_VERSION || 'v1',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'user_service_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  apiKey: {
    key: process.env.X_API_KEY || 'your_internal_api_key_here',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    authWindowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10),
    authMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '5', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    filePath: process.env.LOG_FILE_PATH || 'logs/app.log',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
} as const;

// Type for the config object
export type Config = typeof config; 