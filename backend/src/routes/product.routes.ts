import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    createProductReview,
} from '../controllers/product.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router
    .route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;
