import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import connectDB from './config/db';
import logger from './utils/logger';
import { notFound, errorHandler } from './middlewares/error.middleware';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import cartRoutes from './routes/cart.routes';

dotenv.config();

const requiredEnv = [
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRE',
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}`);
}

// Connect to MongoDB
connectDB();

const app: Express = express();

const sanitizeNoSqlPayload = (value: any): any => {
    if (Array.isArray(value)) {
        return value.map((item) => sanitizeNoSqlPayload(item));
    }

    if (value && typeof value === 'object') {
        const sanitizedEntries = Object.entries(value)
            .filter(([key]) => !key.startsWith('$') && !key.includes('.'))
            .map(([key, nestedValue]) => [key, sanitizeNoSqlPayload(nestedValue)]);

        return Object.fromEntries(sanitizedEntries);
    }

    return value;
};

// Security Middleware
app.use(helmet());

const defaultAllowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const envAllowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
const allowedOrigins = envAllowedOrigins.length > 0 ? envAllowedOrigins : defaultAllowedOrigins;
const localhostOriginRegex = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/i;

// CORS config
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || localhostOriginRegex.test(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection (Express 5 safe)
app.use((req, res, next) => {
    if (req.body) {
        req.body = sanitizeNoSqlPayload(req.body);
    }

    if (req.params) {
        Object.assign(req.params, sanitizeNoSqlPayload(req.params));
    }

    if (req.query) {
        Object.assign(req.query as any, sanitizeNoSqlPayload(req.query));
    }

    next();
});

// Custom XSS Sanitization Middleware using DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window as any);
app.use((req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = purify.sanitize(req.body[key]);
            }
        }
    }
    next();
});

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// API Routes
// Static asset serving for product images
import path from 'path';
app.use('/assets/products', express.static(path.join(__dirname, 'assets/products')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', cartRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
