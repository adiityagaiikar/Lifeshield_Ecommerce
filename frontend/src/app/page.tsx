'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import FloatingCard from '@/components/ui/FloatingCard';
import api from '@/lib/api';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
}

const getImageSrc = (image: string) => {
  if (!image || image === 'no-photo.jpg') {
    return '/placeholder.jpg';
  }
  return image.startsWith('/') ? image : `/${image}`;
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await api.get<{ products: Product[] }>('/products');
        setFeaturedProducts(data.products.slice(0, 4));
      } catch {
        setFeaturedProducts([]);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[80vh] flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="z-10 flex flex-col items-center gap-6 max-w-4xl"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mix-blend-plus-lighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
            PREPAREDNESS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-emerald to-primary-violet">MADE SIMPLE</span>
          </h1>
          <p className="text-tactical mt-4 max-w-xl mx-auto leading-relaxed text-gray-400">
            [ SECURE / DEPLOY / SURVIVE ] <br />
            ENTERPRISE-GRADE EMERGENCY KITS AND EXPEDITIONARY GEAR.
            BUILT FOR THE UNKNOWN. ENGINEERED FOR ZERO GRAVITY PERFORMANCE.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/products">
              <MagneticButton accent="emerald" className="text-lg">
                Browse Catalog
              </MagneticButton>
            </Link>
            <Link href="/dashboard">
              <MagneticButton accent="violet" className="text-lg">
                Open Intel
              </MagneticButton>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 pointer-events-none flex justify-center items-center"
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full border border-white/5 opacity-50 absolute" />
          <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full border border-primary-emerald/10 opacity-30 absolute rotate-45" />
          <div className="w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full border border-primary-violet/10 opacity-20 absolute -rotate-12" />
        </motion.div>
      </section>

      <section className="py-24 relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-12">
        <div className="text-tactical border-b border-white/10 pb-4">
          [ FEATURED ASSETS ]
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product, index) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className={index === 0 ? 'md:col-span-2 lg:col-span-2 row-span-2' : 'row-span-1'}
              >
                <FloatingCard
                  className={`h-full ${index === 0 ? 'bg-gradient-to-br from-void-800 to-void-900' : 'bg-void-800'}`}
                  title={product.name}
                  subtitle={`[ ${product.category.toUpperCase()} ]`}
                  imageSrc={getImageSrc(product.image)}
                  delay={0.1 + (index * 0.1)}
                >
                  <div className="mt-4 flex justify-between items-center w-full">
                    <span className="font-mono text-xl text-primary-emerald font-bold">${product.price.toFixed(2)}</span>
                    <span className={`text-tactical px-2 py-1 ${product.stock > 0 ? 'bg-primary-emerald/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {product.stock > 0 ? 'DEPLOYABLE' : 'DEPLETED'}
                    </span>
                  </div>
                </FloatingCard>
              </Link>
            ))
          ) : (
            <div className="md:col-span-3 lg:col-span-4 glass-panel p-10 text-center">
              <p className="text-tactical">LIVE ASSET FEED IS OFFLINE. CHECK BACK SHORTLY.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
