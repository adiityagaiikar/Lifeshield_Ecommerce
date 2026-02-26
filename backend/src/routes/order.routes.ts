import express from 'express';
import {
    addOrderItems,
    getOrderById,
    getMyOrders,
    updateOrderToDispatched,
} from '../controllers/order.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/dispatch').put(protect, admin, updateOrderToDispatched);

export default router;
