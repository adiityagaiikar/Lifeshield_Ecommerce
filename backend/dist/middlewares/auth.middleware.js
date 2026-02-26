"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const logger_1 = __importDefault(require("../utils/logger"));
const protect = async (req, res, next) => {
    let token;
    // Check headers for authorization token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        logger_1.default.warn(`Unauthorized access attempt from IP: ${req.ip}`);
        res.status(401);
        return next(new Error('Not authorized to access this route'));
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401);
            return next(new Error('User not found'));
        }
        req.user = user;
        next();
    }
    catch (error) {
        logger_1.default.error('Token verification failed', { error });
        res.status(401);
        return next(new Error('Not authorized to access this route'));
    }
};
exports.protect = protect;
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        logger_1.default.warn(`Forbidden access attempt from user: ${req.user?._id}`);
        res.status(403);
        return next(new Error('Not authorized as an admin'));
    }
};
exports.admin = admin;
//# sourceMappingURL=auth.middleware.js.map