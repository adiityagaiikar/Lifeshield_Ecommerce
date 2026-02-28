'use client';

import React, { useEffect, useMemo, useState } from 'react';
import FloatingCard from '@/components/ui/FloatingCard';
import SidebarFilter from './SidebarFilter';
import GlassInput from '@/components/ui/GlassInput';
import api from '@/lib/api';
import Link from 'next/link';
import MagneticButton from '@/components/ui/MagneticButton';
import { addToCart } from '@/lib/features/cartSlice';
import { useAppDispatch } from '@/lib/hooks';
import { getProductImageSrc } from '@/lib/productImage';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    stock: number;
    description?: string;
    rating?: number;
    numReviews?: number;
}

interface ProductResponse {
    products: Product[];
    page: number;
    pages: number;
}

const FALLBACK_CATEGORIES = [
    'Water Purification',
    'Tactical Medkits',
    'Long-Term Rations',
    'Power & Comms',
    'Shelter & Warmth',
    'Tools & Hardware',
];

export default function ProductsPage() {
    const dispatch = useAppDispatch();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [stockFilter, setStockFilter] = useState<'all' | 'in-stock'>('all');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setKeyword(searchValue);
            setPage(1);
        }, 250);

        return () => clearTimeout(timeout);
    }, [searchValue]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                setError('');

                const { data } = await api.get<ProductResponse>('/products', {
                    params: {
                        pageNumber: page,
                        keyword,
                        category: selectedCategory || undefined,
                    },
                });

                setProducts(data.products || []);
                setPages(data.pages || 1);
            } catch {
                setError('Unable to load products right now.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [page, keyword, selectedCategory]);

    const visibleProducts = useMemo(() => {
        if (stockFilter === 'in-stock') {
            return products.filter((product) => product.stock > 0);
        }
        return products;
    }, [products, stockFilter]);

    const categories = useMemo(() => {
        const liveCategories = Array.from(new Set(products.map((item) => item.category)));
        if (liveCategories.length > 0) {
            return liveCategories;
        }
        return FALLBACK_CATEGORIES;
    }, [products]);

    const handleReset = () => {
        setSearchValue('');
        setKeyword('');
        setSelectedCategory('');
        setStockFilter('all');
        setPage(1);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 pb-24">
            <SidebarFilter
                categories={categories}
                selectedCategory={selectedCategory}
                stockFilter={stockFilter}
                onCategoryChange={(category) => {
                    setSelectedCategory(category);
                    setPage(1);
                }}
                onStockFilterChange={setStockFilter}
                onReset={handleReset}
            />

            <div className="flex-1 flex flex-col gap-8">
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-white/90">PRODUCT CATALOG</h1>
                        <p className="text-tactical mt-2">{visibleProducts.length} products visible</p>
                    </div>
                    <div className="w-full md:w-72">
                        <GlassInput
                            icon
                            placeholder="Search products..."
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                        />
                    </div>
                </div>

                {error && <div className="glass-panel p-4 text-sm text-red-600">{error}</div>}

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={`skeleton-${index}`} className="glass-panel rounded-lg h-[340px] animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {visibleProducts.map((product, index) => (
                            <div key={product._id} className="flex flex-col gap-3">
                                <Link href={`/products/${product._id}`}>
                                    <FloatingCard
                                        title={product.name}
                                        subtitle={product.category}
                                        imageSrc={getProductImageSrc(product.image)}
                                        delay={index * 0.05}
                                        className="h-[380px]"
                                    >
                                        <div className="mt-4 flex justify-between items-center w-full gap-3">
                                            <span className="font-mono text-xl text-white/90 font-bold">
                                                ₹{product.price.toFixed(2)}
                                            </span>
                                            <span className={`text-tactical px-2 py-1 rounded-2xl ${product.stock > 0 ? 'bg-white/[0.03] border border-white/10 text-gray-400' : 'bg-red-500/10 border border-red-400/30 text-red-300'}`}>
                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                            </span>
                                        </div>
                                    </FloatingCard>
                                </Link>

                                <button
                                    type="button"
                                    className="hud-button px-4 py-3 rounded-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] disabled:opacity-50"
                                    disabled={product.stock <= 0}
                                    onClick={async () => {
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
                                    }}
                                >
                                    {product.stock > 0 ? 'Add to Cart' : 'Unavailable'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && visibleProducts.length === 0 && (
                    <div className="glass-panel p-8 text-center">
                        <p className="text-tactical">No products match this filter.</p>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-tactical">Page {page} / {pages}</span>
                    <div className="flex gap-3">
                        <MagneticButton
                            className="px-5 py-3 text-xs"
                            accent="white"
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </MagneticButton>
                        <MagneticButton
                            className="px-5 py-3 text-xs"
                            accent="emerald"
                            onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                        >
                            Next
                        </MagneticButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
