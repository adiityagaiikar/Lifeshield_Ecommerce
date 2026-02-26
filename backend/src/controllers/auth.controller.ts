import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import logger from '../utils/logger';

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        if (user) {
            logger.info(`New user registered: ${user.email}`);
            const accessToken = (user as any).getSignedJwtAccessToken();
            const refreshToken = (user as any).getSignedJwtRefreshToken();

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await (user as any).matchPassword(password))) {
            logger.info(`User logged in: ${user.email}`);
            const accessToken = (user as any).getSignedJwtAccessToken();
            const refreshToken = (user as any).getSignedJwtRefreshToken();

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/v1/auth/me
// @access  Private
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById((req as any).user._id);

        if (user) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};
