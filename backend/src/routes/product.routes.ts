import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
} from '../controllers/product.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router
    .route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct);

export default router;
