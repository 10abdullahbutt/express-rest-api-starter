import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { rateLimiter } from '@/middleware/rateLimiter';
import routes from '@/routes';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Request logging
if (process.env['NODE_ENV'] !== 'test') {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'],
  });
});

// API routes
app.use('/api/v1', routes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
