import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB } from '@/config/database';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { rateLimiter } from '@/middleware/rateLimiter';
import routes from '@/routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;

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

// Graceful shutdown handling
const server = app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Server running on port ${PORT} in ${process.env['NODE_ENV']} mode`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
});

// Handle graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app; 