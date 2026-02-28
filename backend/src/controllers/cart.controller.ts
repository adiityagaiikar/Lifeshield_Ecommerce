import { Request, Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import { Product } from '../models/Product';
import Order from '../models/Order';

const recalculateCart = (cart: any) => {
    cart.totalItems = cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
    cart.subtotal = cart.items.reduce((acc: number, item: any) => acc + item.quantity * item.price, 0);
};

const getOrCreateCart = async (userId: string) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [], totalItems: 0, subtotal: 0 });
    }
    return cart;
};

export const getMyCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await getOrCreateCart(String((req as any).user._id));
        await cart.populate('items.product', 'name price image stock stockCount');
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
};

export const addCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId, quantity } = req.body;
        const normalizedQuantity = Math.max(1, Number(quantity) || 1);
        const product = await Product.findById(productId);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        const availableStock = typeof product.stock === 'number' ? product.stock : product.stockCount;
        if (availableStock <= 0) {
            res.status(400);
            throw new Error('Product is out of stock');
        }

        const cart = await getOrCreateCart(String((req as any).user._id));
        const itemIndex = cart.items.findIndex((item: any) => String(item.product) === String(product._id));

        if (itemIndex >= 0 && cart.items[itemIndex]) {
            const existingItem = cart.items[itemIndex];
            existingItem.quantity = Math.min(existingItem.quantity + normalizedQuantity, availableStock);
            existingItem.price = product.price;
            existingItem.name = product.name;
            existingItem.image = product.image;
        } else {
            cart.items.push({
                product: product._id,
                quantity: Math.min(normalizedQuantity, availableStock),
                price: product.price,
                name: product.name,
                image: product.image,
            } as any);
        }

        recalculateCart(cart);
        const updated = await cart.save();
        await updated.populate('items.product', 'name price image stock stockCount');

        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { quantity } = req.body;
        const normalizedQuantity = Math.max(1, Number(quantity) || 1);
        const cart = await getOrCreateCart(String((req as any).user._id));

        const item = cart.items.find((entry: any) => String(entry._id) === String(req.params.itemId));
        if (!item) {
            res.status(404);
            throw new Error('Cart item not found');
        }

        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        const availableStock = typeof product.stock === 'number' ? product.stock : product.stockCount;
        item.quantity = Math.min(normalizedQuantity, availableStock);
        item.price = product.price;
        item.name = product.name;
        item.image = product.image;

        recalculateCart(cart);
        const updated = await cart.save();
        await updated.populate('items.product', 'name price image stock stockCount');

        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await getOrCreateCart(String((req as any).user._id));
        cart.items = cart.items.filter((item: any) => String(item._id) !== String(req.params.itemId));
        recalculateCart(cart);

        const updated = await cart.save();
        await updated.populate('items.product', 'name price image stock stockCount');

        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await getOrCreateCart(String((req as any).user._id));
        cart.items = [];
        recalculateCart(cart);

        const updated = await cart.save();
        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

export const checkoutCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cart = await getOrCreateCart(String((req as any).user._id));

        if (!cart.items.length) {
            res.status(400);
            throw new Error('Cart is empty');
        }

        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product) {
                res.status(404);
                throw new Error('Product not found during checkout');
            }
            const availableStock = typeof product.stock === 'number' ? product.stock : product.stockCount;
            if (availableStock < item.quantity) {
                res.status(400);
                throw new Error(`Insufficient stock for ${product.name}`);
            }
        }

        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product) {
                continue;
            }
            const availableStock = typeof product.stock === 'number' ? product.stock : product.stockCount;
            const nextStock = Math.max(0, availableStock - item.quantity);
            product.stock = nextStock;
            product.stockCount = nextStock;
            await product.save();
        }

        const shippingAddress = req.body?.shippingAddress || {
            address: 'To be provided at payment',
            city: 'N/A',
            postalCode: '000000',
            country: 'N/A',
        };

        const paymentMethod = req.body?.paymentMethod || 'COD';
        const taxPrice = Number(req.body?.taxPrice ?? cart.subtotal * 0.05);
        const shippingPrice = Number(req.body?.shippingPrice ?? (cart.subtotal > 0 ? 49 : 0));
        const totalPrice = Number(req.body?.totalPrice ?? (cart.subtotal + taxPrice + shippingPrice));

        const order = await Order.create({
            user: (req as any).user._id,
            orderItems: cart.items.map((item: any) => ({
                product: item.product,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        cart.items = [];
        recalculateCart(cart);
        await cart.save();

        res.status(201).json({
            message: 'Checkout completed',
            order,
        });
    } catch (error) {
        next(error);
    }
};
