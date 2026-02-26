import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import logger from '../utils/logger';

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;

        // Keyword search
        const keyword = req.query.keyword
            ? {
                $text: {
                    $search: req.query.keyword as string,
                },
            }
            : {};

        // Category filter  
        const category = req.query.category ? { category: req.query.category } : {};

        const count = await Product.countDocuments({ ...keyword, ...category });
        const products = await Product.find({ ...keyword, ...category })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = new Product({
            name: 'Sample name',
            sku: `SKU-${Date.now()}`,
            price: 0,
            description: 'Sample description',
            image: '/images/sample.jpg',
            category: 'Water Purification',
            stock: 0,
        });

        const createdProduct = await product.save();
        logger.info(`New product created: ${createdProduct._id}`);
        res.status(201).json(createdProduct);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            name,
            price,
            description,
            image,
            category,
            stock,
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = image;
            product.category = category;
            product.stock = stock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};
