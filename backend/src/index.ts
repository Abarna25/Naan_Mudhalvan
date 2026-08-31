import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { errorHandler } from './middlewares/error.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Swagger Documentation setup
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Naan Mudhalvan Automated Portfolio Compiler & Eligibility Assessment Engine API',
    version: '1.0.0',
    description: 'Production-ready REST API specifications with JWT RBAC authentication.',
  },
  servers: [{ url: `http://localhost:${PORT}/api/v1` }],
  paths: {
    '/auth/register': { post: { summary: 'Register new user', responses: { 201: { description: 'Success' } } } },
    '/auth/login': { post: { summary: 'User login & get JWT', responses: { 200: { description: 'Success' } } } },
    '/student/profile': { get: { summary: 'Get full student profile', responses: { 200: { description: 'Success' } } } },
    '/assessment/predict': { post: { summary: 'Run Explainable AI employment eligibility assessment', responses: { 200: { description: 'Success' } } } },
  },
};

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount REST API
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

// Welcome / Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'UP',
    service: 'Naan Mudhalvan Trust Architecture API Engine',
    message: 'Backend REST API is running successfully.',
    documentation: '/api/v1/docs',
    healthCheck: '/health',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'Naan Mudhalvan Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Naan Mudhalvan Backend API running on http://localhost:${PORT}`);
  console.log(`📑 Swagger Documentation available at http://localhost:${PORT}/api/v1/docs`);
});

export default app;
