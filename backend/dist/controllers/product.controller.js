"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const logger_1 = __importDefault(require("../utils/logger"));
// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        // Keyword search
        const keyword = req.query.keyword
            ? {
                $text: {
                    $search: req.query.keyword,
                },
            }
            : {};
        // Category filter  
        const category = req.query.category ? { category: req.query.category } : {};
        const count = await Product_1.default.countDocuments({ ...keyword, ...category });
        const products = await Product_1.default.find({ ...keyword, ...category })
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
// @desc    Fetch single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404);
            throw new Error('Product not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    try {
        const product = new Product_1.default({
            name: 'Sample name',
            sku: `SKU-${Date.now()}`,
            price: 0,
            description: 'Sample description',
            image: '/images/sample.jpg',
            category: 'Water Purification',
            stock: 0,
        });
        const createdProduct = await product.save();
        logger_1.default.info(`New product created: ${createdProduct._id}`);
        res.status(201).json(createdProduct);
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    try {
        const { name, price, description, image, category, stock, } = req.body;
        const product = await Product_1.default.findById(req.params.id);
        if (product) {
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = image;
            product.category = category;
            product.stock = stock;
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }
        else {
            res.status(404);
            throw new Error('Product not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
//# sourceMappingURL=product.controller.js.map