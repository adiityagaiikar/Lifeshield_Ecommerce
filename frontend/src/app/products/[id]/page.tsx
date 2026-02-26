'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import Accordion from '@/components/ui/Accordion';
import api from '@/lib/api';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
    techSpecs?: {
        weight?: string;
        dimensions?: string;
        material?: string;
        warranty?: string;
    };
}

const getImageSrc = (image: string) => {
    if (!image || image === 'no-photo.jpg') {
        return '/placeholder.jpg';
    }
    return image.startsWith('/') ? image : `/${image}`;
};

export default function ProductDetailsPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
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

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const techSpecs = useMemo(() => {
        if (!product?.techSpecs) {
            return [
                { title: 'Specifications', content: 'Detailed technical specifications are available on request.' },
            ];
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
                <h1 className="text-3xl font-black tracking-tight">ASSET NOT FOUND</h1>
                <p className="text-tactical">The requested manifest entry is unavailable.</p>
                <Link href="/products" className="text-primary-emerald font-mono tracking-wider text-sm">
                    Return to Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)] relative pb-24">
            <div className="lg:w-1/2 w-full lg:sticky lg:top-24 h-[50vh] lg:h-[calc(100vh-6rem)] flex flex-col gap-4 pr-0 lg:pr-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    className="relative w-full h-full glass-panel overflow-hidden group cursor-crosshair"
                >
                    <Image
                        src={getImageSrc(product.image)}
                        alt={product.name}
                        fill
                        className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 mix-blend-screen"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                        <span className="text-tactical">[ ASSET VISUALIZATION ]</span>
                        <span className="text-tactical text-primary-emerald mix-blend-screen">CAM 01 // OVERVIEW</span>
                    </div>
                    <div className="absolute inset-0 border-[1px] border-primary-emerald/10 scale-[0.98] pointer-events-none" />
                </motion.div>
            </div>

            <div className="lg:w-1/2 w-full pt-12 lg:pt-0 flex flex-col gap-8 lg:pl-12 border-l-0 lg:border-l border-white/5">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-4"
                >
                    <div className="flex justify-between items-center">
                        <span className="text-tactical text-primary-violet">[ {product.category.toUpperCase()} ]</span>
                        <span className="text-tactical">SKU: {product.sku}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mix-blend-plus-lighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                        {product.name}
                    </h1>

                    <div className="text-4xl font-mono text-primary-emerald drop-shadow-glow-emerald">
                        ${product.price.toFixed(2)}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-gray-400 leading-relaxed text-lg">
                        {product.description}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4"
                >
                    <MagneticButton accent="emerald" className="w-full text-lg py-6 shadow-glow-emerald">
                        Add to Repertoire
                    </MagneticButton>
                    <div className="mt-4 flex justify-between items-center px-2">
                        <span className="text-tactical">STATUS</span>
                        <span className={`text-tactical ${product.stock > 0 ? 'text-primary-emerald' : 'text-red-500'}`}>
                            [ {product.stock > 0 ? 'READY FOR DEPLOYMENT' : 'AWAITING RESUPPLY'} ]
                        </span>
                    </div>
                </motion.div>

                {product.features && product.features.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        className="glass-panel p-5 rounded-sm"
                    >
                        <div className="text-tactical mb-3">[ KEY FEATURES ]</div>
                        <ul className="text-gray-300 space-y-2 text-sm">
                            {product.features.map((feature) => (
                                <li key={feature}>• {feature}</li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8"
                >
                    <div className="text-tactical mb-4">[ TECHNICAL SPECIFICATIONS ]</div>
                    <Accordion items={techSpecs} />
                </motion.div>

            </div>
        </div>
    );
}
