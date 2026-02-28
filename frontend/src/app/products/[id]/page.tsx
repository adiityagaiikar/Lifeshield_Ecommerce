'use client';

import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import Accordion from '@/components/ui/Accordion';
import api from '@/lib/api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { addToCart } from '@/lib/features/cartSlice';
import { useAppDispatch } from '@/lib/hooks';
import { getProductImageSrc } from '@/lib/productImage';

interface ProductReview {
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface Product {
    _id: string;
    name: string;
    sku: string;
    price: number;
    category: string;
    description: string;
    stock: number;
    image: string;
    features?: string[];
    rating?: number;
    numReviews?: number;
    reviews?: ProductReview[];
    techSpecs?: {
        weight?: string;
        dimensions?: string;
        material?: string;
        warranty?: string;
    };
}

export default function ProductDetailsPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = params.id;

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');

    const fetchProduct = async () => {
        try {
            setIsLoading(true);
            setNotFound(false);
            const { data } = await api.get<Product>(`/products/${id}`);
            setProduct(data);
        } catch {
            setNotFound(true);
            setProduct(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const techSpecs = useMemo(() => {
        if (!product?.techSpecs) {
            return [{ title: 'Specifications', content: 'Detailed technical specifications are available on request.' }];
        }

        return [
            { title: 'Dimensions', content: product.techSpecs.dimensions || 'N/A' },
            { title: 'Weight', content: product.techSpecs.weight || 'N/A' },
            { title: 'Material', content: product.techSpecs.material || 'N/A' },
            { title: 'Warranty', content: product.techSpecs.warranty || 'N/A' },
        ];
    }, [product]);

    if (isLoading) {
        return <div className="glass-panel h-[70vh] animate-pulse rounded-lg" />;
    }

    if (notFound || !product) {
        return (
            <div className="glass-panel p-10 text-center flex flex-col gap-4">
                <h1 className="text-3xl font-black tracking-tight text-white/90">PRODUCT NOT FOUND</h1>
                <p className="text-tactical">The requested product is unavailable.</p>
                <Link href="/products" className="text-white/90 font-mono tracking-[0.2em] text-xs font-bold uppercase">
                    Return to Catalog
                </Link>
            </div>
        );
    }

    const handleAddToCart = async () => {
        dispatch(
            addToCart({
                productId: product._id,
                name: product.name,
                image: getProductImageSrc(product.image),
                price: product.price,
                quantity: 1,
                stock: product.stock,
            })
        );

        try {
            await api.post('/cart/items', { productId: product._id, quantity: 1 });
        } catch {
        }
    };

    const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setReviewMessage('');

        try {
            await api.post(`/products/${product._id}/reviews`, { rating, comment });
            setComment('');
            setReviewMessage('Review submitted successfully.');
            await fetchProduct();
        } catch {
            setReviewMessage('Login is required, or you may have already reviewed this product.');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)] relative pb-24 gap-10">
            <div className="lg:w-1/2 w-full lg:sticky lg:top-24 h-[50vh] lg:h-[calc(100vh-6rem)] flex flex-col gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45 }}
                    className="relative w-full h-full glass-panel overflow-hidden"
                >
                    <img
                        src={getProductImageSrc(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white/[0.03] border border-white/10 px-3 py-2 rounded-2xl text-tactical">
                        {product.category}
                    </div>
                </motion.div>
            </div>

            <div className="lg:w-1/2 w-full pt-2 flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <span className="text-tactical">SKU: {product.sku}</span>
                        <span className="text-tactical">Rating: {(product.rating || 0).toFixed(1)} ({product.numReviews || 0})</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white/90">{product.name}</h1>

                    <div className="text-3xl font-mono text-white/90 font-bold">₹{product.price.toFixed(2)}</div>
                </div>

                <p className="text-gray-400 leading-relaxed text-lg">{product.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MagneticButton accent="emerald" className="w-full text-base py-4" onClick={handleAddToCart}>
                        Add to Cart
                    </MagneticButton>
                    <MagneticButton
                        accent="white"
                        className="w-full text-base py-4"
                        onClick={() => {
                            handleAddToCart();
                            router.push('/cart');
                        }}
                    >
                        Buy Now
                    </MagneticButton>
                </div>

                <div className="flex justify-between items-center px-2">
                    <span className="text-tactical">Status</span>
                    <span className={`text-sm font-mono ${product.stock > 0 ? 'text-gray-400' : 'text-red-300'}`}>
                        {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                    </span>
                </div>

                {product.features && product.features.length > 0 && (
                    <div className="glass-panel p-5 rounded-sm">
                        <div className="text-tactical mb-3">Key Features</div>
                        <ul className="text-gray-400 space-y-2 text-sm">
                            {product.features.map((feature) => (
                                <li key={feature}>• {feature}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    <div className="text-tactical mb-4">Technical Specifications</div>
                    <Accordion items={techSpecs} />
                </div>

                <div className="glass-panel p-5">
                    <h3 className="font-bold text-white/90 mb-3">Reviews</h3>
                    <div className="space-y-3 mb-6">
                        {(product.reviews || []).length === 0 && <p className="text-sm text-gray-500">No reviews yet.</p>}
                        {(product.reviews || []).map((review, index) => (
                            <div key={`${review.name}-${index}`} className="border border-white/10 bg-white/[0.03] rounded-2xl p-3">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-white/90">{review.name}</span>
                                    <span className="text-gray-500">{review.rating}/5</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">{review.comment}</p>
                            </div>
                        ))}
                    </div>

                    <form className="space-y-3" onSubmit={handleReviewSubmit}>
                        <div>
                            <label className="text-xs font-mono tracking-widest text-gray-500">Rating</label>
                            <select
                                value={rating}
                                onChange={(event) => setRating(Number(event.target.value))}
                                className="w-full mt-1 border border-white/10 bg-white/[0.03] p-2 text-sm text-white/90 rounded-2xl"
                            >
                                {[5, 4, 3, 2, 1].map((value) => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-mono tracking-widest text-gray-500">Comment</label>
                            <textarea
                                value={comment}
                                onChange={(event) => setComment(event.target.value)}
                                className="w-full mt-1 border border-white/10 bg-white/[0.03] p-2 text-sm text-white/90 min-h-[90px] rounded-2xl"
                                required
                            />
                        </div>
                        {reviewMessage && <p className="text-xs text-gray-400">{reviewMessage}</p>}
                        <button type="submit" className="hud-button px-4 py-3 rounded-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]">
                            Submit Review
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
