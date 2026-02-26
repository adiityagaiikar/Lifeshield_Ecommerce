"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderToDispatched = exports.getMyOrders = exports.getOrderById = exports.addOrderItems = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const logger_1 = __importDefault(require("../utils/logger"));
// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
const addOrderItems = async (req, res, next) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice, } = req.body;
        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
        }
        else {
            const order = new Order_1.default({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                taxPrice,
                shippingPrice,
                totalPrice,
            });
            const createdOrder = await order.save();
            logger_1.default.info(`New order placed: ${createdOrder._id} by user ${req.user._id}`);
            res.status(201).json(createdOrder);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.addOrderItems = addOrderItems;
// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order_1.default.findById(req.params.id).populate('user', 'name email');
        if (order) {
            res.json(order);
        }
        else {
            res.status(404);
            throw new Error('Order not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderById = getOrderById;
// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order_1.default.find({ user: req.user._id });
        res.json(orders);
    }
    catch (error) {
        next(error);
    }
};
exports.getMyOrders = getMyOrders;
// @desc    Update order to dispatched
// @route   PUT /api/v1/orders/:id/dispatch
// @access  Private/Admin
const updateOrderToDispatched = async (req, res, next) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (order) {
            order.status = 'DISPATCHED';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        }
        else {
            res.status(404);
            throw new Error('Order not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrderToDispatched = updateOrderToDispatched;
//# sourceMappingURL=order.controller.js.map