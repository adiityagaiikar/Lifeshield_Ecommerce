"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const logger_1 = __importDefault(require("../utils/logger"));
// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }
        const user = await User_1.default.create({
            name,
            email,
            password,
            role
        });
        if (user) {
            logger_1.default.info(`New user registered: ${user.email}`);
            const accessToken = user.getSignedJwtAccessToken();
            const refreshToken = user.getSignedJwtRefreshToken();
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken
            });
        }
        else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
            logger_1.default.info(`User logged in: ${user.email}`);
            const accessToken = user.getSignedJwtAccessToken();
            const refreshToken = user.getSignedJwtRefreshToken();
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
                refreshToken
            });
        }
        else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
// @desc    Get user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.user._id);
        if (user) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        }
        else {
            res.status(404);
            throw new Error('User not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=auth.controller.js.map