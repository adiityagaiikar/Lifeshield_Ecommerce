import express from 'express';
import {
    getMyCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
    checkoutCart,
} from '../controllers/cart';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(protect, getMyCart);
router.route('/items').post(protect, addCartItem);
router.route('/items/:itemId').put(protect, updateCartItem).delete(protect, removeCartItem);
router.route('/clear').delete(protect, clearCart);
router.route('/checkout').post(protect, checkoutCart);

export default router;
