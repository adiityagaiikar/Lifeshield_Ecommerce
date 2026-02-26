"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const dompurify_1 = __importDefault(require("dompurify"));
const jsdom_1 = require("jsdom");
const db_1 = __importDefault(require("./config/db"));
const logger_1 = __importDefault(require("./utils/logger"));
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
dotenv_1.default.config();
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
(0, db_1.default)();
const app = (0, express_1.default)();
// Security Middleware
app.use((0, helmet_1.default)());
const defaultAllowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const envAllowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
const allowedOrigins = envAllowedOrigins.length > 0 ? envAllowedOrigins : defaultAllowedOrigins;
// CORS config
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
// Body parser
app.use(express_1.default.json({ limit: '10kb' }));
// Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Custom XSS Sanitization Middleware using DOMPurify
const window = new jsdom_1.JSDOM('').window;
const purify = (0, dompurify_1.default)(window);
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
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});
// API Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/products', product_routes_1.default);
app.use('/api/v1/orders', order_routes_1.default);
// Error Handling Middleware
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger_1.default.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
//# sourceMappingURL=index.js.map