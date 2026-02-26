'use client';

import React, { useEffect, useMemo, useState } from 'react';
import FloatingCard from '@/components/ui/FloatingCard';
import SidebarFilter from './SidebarFilter';
import GlassInput from '@/components/ui/GlassInput';
import api from '@/lib/api';
import Link from 'next/link';
import MagneticButton from '@/components/ui/MagneticButton';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    stock: number;
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

const getImageSrc = (image: string) => {
    if (!image || image === 'no-photo.jpg') {
        return '/placeholder.jpg';
    }
    return image.startsWith('/') ? image : `/${image}`;
};

export default function ProductsPage() {
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
        }, 350);

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

                setProducts(data.products);
                setPages(data.pages || 1);
            } catch {
                setError('Unable to load deployment assets.');
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
                        <h1 className="text-4xl font-black tracking-tight">ASSET CATALOG</h1>
                        <p className="text-tactical mt-2">SHOWING {visibleProducts.length} DEPLOYMENT ASSETS</p>
                    </div>
                    <div className="w-full md:w-72">
                        <GlassInput
                            icon
                            placeholder="SEARCH INTEL..."
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                        />
                    </div>
                </div>

                {error && <div className="glass-panel p-4 text-sm text-red-400">{error}</div>}

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={`skeleton-${index}`} className="glass-panel rounded-lg h-[320px] animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {visibleProducts.map((product, index) => (
                            <Link key={product._id} href={`/products/${product._id}`}>
                                <FloatingCard
                                    title={product.name}
                                    subtitle={`[ ${product.category.toUpperCase()} ]`}
                                    imageSrc={getImageSrc(product.image)}
                                    delay={index * 0.08}
                                    className="h-[420px]"
                                >
                                    <div className="mt-4 flex justify-between items-center w-full">
                                        <span className="font-mono text-xl text-primary-emerald font-bold">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <span className={`text-tactical px-2 py-1 ${product.stock > 0 ? 'bg-primary-emerald/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {product.stock > 0 ? 'DEPLOYABLE' : 'DEPLETED'}
                                        </span>
                                    </div>
                                </FloatingCard>
                            </Link>
                        ))}
                    </div>
                )}

                {!isLoading && visibleProducts.length === 0 && (
                    <div className="glass-panel p-8 text-center">
                        <p className="text-tactical">NO ASSETS MATCH CURRENT INTEL FILTERS</p>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <span className="text-tactical">PAGE {page} / {pages}</span>
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
