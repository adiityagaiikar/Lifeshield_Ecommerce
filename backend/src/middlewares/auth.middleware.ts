import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import logger from '../utils/logger';

interface JwtPayload {
    id: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Check headers for authorization token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        logger.warn(`Unauthorized access attempt from IP: ${req.ip}`);
        res.status(401);
        return next(new Error('Not authorized to access this route'));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401);
            return next(new Error('User not found'));
        }

        (req as any).user = user;
        next();
    } catch (error) {
        logger.error('Token verification failed', { error });
        res.status(401);
        return next(new Error('Not authorized to access this route'));
    }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).user && (req as any).user.role === 'admin') {
        next();
    } else {
        logger.warn(`Forbidden access attempt from user: ${(req as any).user?._id}`);
        res.status(403);
        return next(new Error('Not authorized as an admin'));
    }
};
