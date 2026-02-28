"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHighDemandProductsByRegion = exports.createProductReview = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = require("../models/Product");
const UserAssessment_1 = require("../models/UserAssessment");
const serializeProduct = (product) => {
    const resolvedStock = typeof product.stock === 'number' ? product.stock : product.stockCount;
    const safeStock = typeof resolvedStock === 'number' ? resolvedStock : 0;
    const imageValue = String(product.image || '/assets/products/default.svg');
    const image = imageValue.startsWith('/products/')
        ? imageValue.replace('/products/', '/assets/products/')
        : imageValue;
    return {
        _id: product._id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        description: product.description,
        image,
        stock: safeStock,
        stockCount: safeStock,
        baseShelfLifeDays: product.baseShelfLifeDays,
        tags: product.tags || [],
        demandVelocity: product.demandVelocity || 0,
        features: product.features || [],
        techSpecs: product.techSpecs || {},
        reviews: product.reviews || [],
        numReviews: product.numReviews || 0,
        rating: product.rating || 0,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
};
const getProducts = async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : '';
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const filter = {};
    if (keyword) {
        filter.$text = { $search: keyword };
    }
    if (category) {
        filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    const count = await Product_1.Product.countDocuments(filter);
    const products = await Product_1.Product.find(filter)
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    res.status(200).json({
        products: products.map(serializeProduct),
        page,
        pages: Math.max(1, Math.ceil(count / pageSize)),
        total: count,
    });
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    const product = await Product_1.Product.findById(req.params.id);
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
    }
    res.status(200).json(serializeProduct(product));
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    const payload = req.body || {};
    const stockValue = Number(payload.stock ?? payload.stockCount ?? 0);
    const createdProduct = await Product_1.Product.create({
        name: payload.name || 'New Product',
        sku: payload.sku || `SKU-${Date.now()}`,
        category: payload.category || 'General',
        price: Number(payload.price ?? 0),
        description: payload.description || 'Product description',
        image: payload.image || '/assets/products/default.svg',
        stock: stockValue,
        stockCount: stockValue,
        baseShelfLifeDays: Number(payload.baseShelfLifeDays ?? 365),
        tags: Array.isArray(payload.tags) ? payload.tags : [],
        demandVelocity: Number(payload.demandVelocity ?? 0),
        features: Array.isArray(payload.features) ? payload.features : [],
        techSpecs: payload.techSpecs || {},
    });
    res.status(201).json(serializeProduct(createdProduct));
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const product = await Product_1.Product.findById(req.params.id);
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
    }
    const payload = req.body || {};
    const hasStockUpdate = payload.stock !== undefined || payload.stockCount !== undefined;
    product.name = payload.name ?? product.name;
    product.sku = payload.sku ?? product.sku;
    product.category = payload.category ?? product.category;
    product.price = Number(payload.price ?? product.price);
    product.description = payload.description ?? product.description;
    product.image = payload.image ?? product.image;
    product.baseShelfLifeDays = Number(payload.baseShelfLifeDays ?? product.baseShelfLifeDays);
    product.tags = Array.isArray(payload.tags) ? payload.tags : product.tags;
    product.demandVelocity = Number(payload.demandVelocity ?? product.demandVelocity);
    product.features = Array.isArray(payload.features) ? payload.features : product.features;
    product.techSpecs = payload.techSpecs ?? product.techSpecs;
    if (hasStockUpdate) {
        const stockValue = Number(payload.stock ?? payload.stockCount ?? product.stock ?? product.stockCount);
        product.stock = stockValue;
        product.stockCount = stockValue;
    }
    const updatedProduct = await product.save();
    res.status(200).json(serializeProduct(updatedProduct));
};
exports.updateProduct = updateProduct;
const createProductReview = async (req, res) => {
    const product = await Product_1.Product.findById(req.params.id);
    if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
    }
    const { rating, comment } = req.body;
    const existingReview = product.reviews.find((item) => String(item.user) === String(req.user._id));
    if (existingReview) {
        res.status(400).json({ message: 'Product already reviewed by this user' });
        return;
    }
    const parsedRating = Number(rating);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
        res.status(400).json({ message: 'Rating must be between 1 and 5' });
        return;
    }
    product.reviews.push({
        user: req.user._id,
        name: req.user.name,
        rating: parsedRating,
        comment: comment || '',
        createdAt: new Date(),
    });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.numReviews;
    await product.save();
    res.status(201).json({ message: 'Review added successfully' });
};
exports.createProductReview = createProductReview;
/**
 * Data Mining Aggregation Controller
 * Analyzes recent purchases and assessments in a specific region to calculate
 * demand velocity and flag high demand products.
 */
const getHighDemandProductsByRegion = async (req, res) => {
    try {
        const region = typeof req.params.region === 'string' ? req.params.region : '';
        // Complex Aggregation Pipeline to determine High Demand Products
        // 1. Find all users in the specified region via UserAssessment
        // 2. Look up their recent inventories/purchases
        // 3. Group by product to calculate demand velocity
        // 4. Join with Product details
        // 5. Filter for items exceeding a demand threshold
        const pipeline = [
            // 1. Match assessments in the region (simulate finding active users there)
            {
                $match: {
                    location: { $regex: new RegExp(region, 'i') }
                }
            },
            // 2. Lookup inventories for these users (simulating recent purchases)
            {
                $lookup: {
                    from: 'userinventories',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'inventories'
                }
            },
            // Unwind to deconstruct the inventories array
            { $unwind: '$inventories' },
            // Consider only recent purchases (e.g., last 30 days) to calculate velocity
            {
                $match: {
                    'inventories.purchaseDate': {
                        // In MongoDB aggregation, we can use an expression or just pass the date via Mongoose
                        $gte: new Date(new Date().setDate(new Date().getDate() - 30))
                    }
                }
            },
            // 3. Group by product to calculate demand score (velocity)
            {
                $group: {
                    _id: '$inventories.productId',
                    demandScore: { $sum: 1 }, // Simple count, could be weighted based on other factors
                    uniqueBuyers: { $addToSet: '$userId' }
                }
            },
            // Calculate velocity taking into account unique buyers density
            {
                $addFields: {
                    calculatedVelocity: {
                        $multiply: ['$demandScore', { $size: '$uniqueBuyers' }]
                    }
                }
            },
            // Filter for products that have a high demand velocity (threshold example: >= 5)
            {
                $match: {
                    calculatedVelocity: { $gte: 5 }
                }
            },
            // 4. Lookup actual product details
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            // 5. Shape the output for the "High Demand" UI rendering
            {
                $project: {
                    _id: 1,
                    name: '$productDetails.name',
                    sku: '$productDetails.sku',
                    category: '$productDetails.category',
                    price: '$productDetails.price',
                    stockCount: '$productDetails.stockCount',
                    demandVelocity: '$calculatedVelocity',
                    isHighDemand: { $literal: true }, // Flag for the frontend UI badge ("🔥 HIGH DEMAND IN YOUR REGION")
                    tags: '$productDetails.tags'
                }
            },
            // Sort by highest demand first
            { $sort: { demandVelocity: -1 } }
        ];
        const highDemandProducts = await UserAssessment_1.UserAssessment.aggregate(pipeline);
        // Note: To further enhance SCM, we could automatically update the Product's 'demandVelocity'
        // field in the DB here based on this calculated result.
        res.status(200).json({
            success: true,
            data: highDemandProducts,
            message: `High demand products fetched for region: ${region}`,
        });
    }
    catch (error) {
        console.error('Error in getHighDemandProductsByRegion:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze demand metrics',
            error: error.message
        });
    }
};
exports.getHighDemandProductsByRegion = getHighDemandProductsByRegion;
//# sourceMappingURL=product.controller.js.map