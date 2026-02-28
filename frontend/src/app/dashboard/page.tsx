'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    createdAt?: string;
}

export default function DashboardPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setIsLoading(true);
                setError('');
                const { data } = await api.get<{ products: Product[] }>('/products', {
                    params: { pageNumber: 1 },
                });
                setProducts(data.products);
            } catch {
                setError('Unable to load operations telemetry.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInventory();
    }, []);

    const metrics = useMemo(() => {
        const totalAssets = products.length;
        const totalStockUnits = products.reduce((acc, product) => acc + product.stock, 0);
        const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= 5).length;
        const outOfStockCount = products.filter((product) => product.stock === 0).length;

        return {
            totalAssets,
            totalStockUnits,
            lowStockCount,
            outOfStockCount,
        };
    }, [products]);

    const lowStockProducts = useMemo(() => {
        return [...products]
            .filter((product) => product.stock <= 5)
            .sort((a, b) => a.stock - b.stock);
    }, [products]);

    const getStockTag = (stock: number) => {
        if (stock === 0) {
            return 'text-red-500 bg-red-500/10 border-red-500/20';
        }

        if (stock <= 5) {
            return 'text-gray-400 bg-white/[0.03] border-white/10';
        }

        return 'text-gray-400 bg-white/[0.03] border-white/10';
    };

    return (
        <div className="flex flex-col gap-12 pb-24 max-w-6xl mx-auto">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-8 pt-12"
            >
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white/90">OPERATIONS CENTER</h1>
                    <p className="text-tactical mt-2">LIVE INVENTORY TELEMETRY // CLEARANCE: STANDARD</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                    <div className="glass-panel px-6 py-4 flex flex-col items-end rounded-sm">
                        <span className="text-tactical text-gray-400">ASSET TYPES</span>
                        <span className="text-2xl font-mono text-white/90">{metrics.totalAssets}</span>
                    </div>
                    <div className="glass-panel px-6 py-4 flex flex-col items-end rounded-sm">
                        <span className="text-tactical text-gray-400">STOCK UNITS</span>
                        <span className="text-2xl font-mono text-white/90">{metrics.totalStockUnits}</span>
                    </div>
                    <div className="glass-panel px-6 py-4 flex flex-col items-end rounded-sm">
                        <span className="text-tactical text-gray-400">LOW STOCK</span>
                        <span className="text-2xl font-mono text-gray-400">{metrics.lowStockCount}</span>
                    </div>
                    <div className="glass-panel px-6 py-4 flex flex-col items-end rounded-sm">
                        <span className="text-tactical text-gray-400">DEPLETED</span>
                        <span className="text-2xl font-mono text-red-500">{metrics.outOfStockCount}</span>
                    </div>
                </div>
            </motion.div>

            {error && <div className="glass-panel p-4 text-sm text-red-400">{error}</div>}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="glass-panel rounded-sm overflow-hidden"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.03]">
                    <h2 className="font-bold tracking-widest text-lg text-white/90">LOW STOCK PRIORITY BOARD</h2>
                    <span className="text-tactical text-gray-400">[ LIVE SUPPLY STATUS ]</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03] text-tactical text-gray-400">
                                <th className="p-4 font-normal">ASSET</th>
                                <th className="p-4 font-normal">CATEGORY</th>
                                <th className="p-4 font-normal">PRICE</th>
                                <th className="p-4 font-normal">STOCK</th>
                                <th className="p-4 font-normal text-right">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-sm">
                            {isLoading && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-tactical">LOADING TELEMETRY...</td>
                                </tr>
                            )}

                            {!isLoading && lowStockProducts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-tactical">ALL CRITICAL ASSETS STABLE</td>
                                </tr>
                            )}

                            {lowStockProducts.map((product, index) => (
                                <motion.tr
                                    key={product._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (index * 0.1) }}
                                    className="border-b border-white/10 hover:bg-white/[0.03] transition-colors group cursor-pointer"
                                >
                                    <td className="p-4 text-white/90 group-hover:text-white transition-colors">
                                        {product.name}
                                    </td>
                                    <td className="p-4 text-gray-400">{product.category}</td>
                                    <td className="p-4 text-white/90">₹{product.price.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 border text-xs tracking-widest ${getStockTag(product.stock)}`}>
                                            [ {product.stock === 0 ? 'DEPLETED' : `${product.stock} UNITS`} ]
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/products/${product._id}`} className="text-tactical text-gray-400 hover:text-white/90 transition-colors">
                                            INSPECT {"->"}
                                        </Link>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

        </div>
    );
}
