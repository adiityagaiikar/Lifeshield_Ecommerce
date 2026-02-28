'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    price: number;
    stockCount: number;
    maxStock: number;
    baseShelfLifeDays: number;
    tags: string[];
    demandVelocity: 'NORMAL' | 'HIGH';
    region?: string;
    description: string;
}

// ─── Mock Data (SCM Demand Analysis) ─────────────────────────────────────────

const MOCK_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Tactical Water Purification Kit',
        sku: 'LS-WPK-001',
        category: 'Water & Hydration',
        price: 4999,
        stockCount: 8,
        maxStock: 60,
        baseShelfLifeDays: 1825,
        tags: ['water', 'purification', 'survival', 'essential'],
        demandVelocity: 'HIGH',
        region: 'Maharashtra',
        description: 'Military-grade filtration. Eliminates 99.99% of pathogens. 5-year shelf life.',
    },
    {
        id: 2,
        name: 'Emergency Ration Pack — 72HR',
        sku: 'LS-ERP-072',
        category: 'Food & Nutrition',
        price: 3499,
        stockCount: 12,
        maxStock: 80,
        baseShelfLifeDays: 1095,
        tags: ['food', 'emergency', 'rations', '72-hour'],
        demandVelocity: 'HIGH',
        region: 'Maharashtra',
        description: 'High-calorie, non-perishable rations. Formulated for peak cognitive function under duress.',
    },
    {
        id: 3,
        name: 'Solar Kinetic Power Bank — 40000mAh',
        sku: 'LS-SPB-400',
        category: 'Power & Energy',
        price: 8999,
        stockCount: 34,
        maxStock: 50,
        baseShelfLifeDays: 3650,
        tags: ['solar', 'power', 'electronics', 'grid-failure'],
        demandVelocity: 'NORMAL',
        description: 'Dual-panel solar + kinetic charge. Powers critical devices for up to 7 days off-grid.',
    },
    {
        id: 4,
        name: 'Advanced Trauma Medical Kit',
        sku: 'LS-MTK-PRO',
        category: 'Medical & First Aid',
        price: 7299,
        stockCount: 27,
        maxStock: 40,
        baseShelfLifeDays: 730,
        tags: ['medical', 'trauma', 'firstaid', 'professional'],
        demandVelocity: 'NORMAL',
        description: 'TCCC-compliant. Tourniquets, haemostatic gauze, chest seals. Designed for untrained responders.',
    },
    {
        id: 5,
        name: 'Faraday EMP-Shield Bag — Pro Series',
        sku: 'LS-FAR-PRO',
        category: 'Electronics Protection',
        price: 2199,
        stockCount: 41,
        maxStock: 60,
        baseShelfLifeDays: 7300,
        tags: ['faraday', 'EMP', 'electronics', 'grid-failure'],
        demandVelocity: 'NORMAL',
        description: 'Mil-Spec RF shielding. Protects devices from EMP events and solar flares.',
    },
    {
        id: 6,
        name: 'Multi-Band HAM Radio — Emergency Comms',
        sku: 'LS-RAD-MB1',
        category: 'Communication',
        price: 12499,
        stockCount: 19,
        maxStock: 30,
        baseShelfLifeDays: 5475,
        tags: ['radio', 'communication', 'HAM', 'grid-failure'],
        demandVelocity: 'NORMAL',
        description: 'Tri-band emergency radio. Weather alerts, repeater capable, 10km range. NOAA certified.',
    },
];

// ─── Stock Level Calculation ──────────────────────────────────────────────────

function getStockPercentage(stockCount: number, maxStock: number): number {
    return Math.round((stockCount / maxStock) * 100);
}

function getStockColorClass(stockCount: number): string {
    if (stockCount < 10) return 'from-rose-600 to-red-500';
    if (stockCount < 20) return 'from-amber-500 to-orange-400';
    return 'from-emerald-500 to-teal-400';
}

function getStockGlowClass(stockCount: number): string {
    if (stockCount < 10) return 'shadow-[0_0_10px_rgba(239,68,68,0.6)]';
    if (stockCount < 20) return 'shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    return 'shadow-[0_0_10px_rgba(52,211,153,0.3)]';
}

function getStockLabel(stockCount: number): string {
    if (stockCount < 10) return 'CRITICAL LOW';
    if (stockCount < 20) return 'LOW STOCK';
    return 'AVAILABLE';
}

// ─── Pulsing Dot (Animated) ───────────────────────────────────────────────────

const PulsingDot = () => (
    <span className="relative flex h-2 w-2">
        <motion.span
            className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"
            animate={{ scale: [1, 2.2, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
    </span>
);

// ─── High Demand Badge ────────────────────────────────────────────────────────

const HighDemandBadge = ({ region }: { region?: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="absolute -top-3 right-4 z-20"
    >
        <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-500/30 bg-black/80 shadow-[0_0_20px_rgba(225,29,72,0.4)] backdrop-blur-lg">
            <PulsingDot />
            <span className="font-mono tracking-widest text-[9px] uppercase text-rose-400 font-semibold whitespace-nowrap">
                🔥 Surge Detected · {region ?? 'Your Region'}
            </span>
        </div>
    </motion.div>
);

// ─── Stock Bar ────────────────────────────────────────────────────────────────

const StockBar = ({ stockCount, maxStock }: { stockCount: number; maxStock: number }) => {
    const pct = getStockPercentage(stockCount, maxStock);
    const colorClass = getStockColorClass(stockCount);
    const glowClass = getStockGlowClass(stockCount);
    const label = getStockLabel(stockCount);

    return (
        <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/30">
                    Inventory
                </span>
                <div className="flex items-center gap-2">
                    {stockCount < 20 && (
                        <motion.span
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                            className="font-mono text-[9px] tracking-widest uppercase text-amber-400"
                        >
                            ⚠ {label}
                        </motion.span>
                    )}
                    <span className="font-mono text-[10px] text-white/40">
                        {stockCount} / {maxStock} units
                    </span>
                </div>
            </div>
            <div className="relative h-[3px] w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                    className={`h-full rounded-full bg-gradient-to-r ${colorClass} ${glowClass}`}
                />
            </div>
        </div>
    );
};

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
    const [hovered, setHovered] = useState(false);
    const [imgError, setImgError] = useState(false);
    const isHighDemand = product.demandVelocity === 'HIGH';
    // Use product.image if available, fallback to default
    const imageSrc = !imgError && product.image ? product.image : '/assets/products/default.svg';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 200,
                damping: 24,
                delay: index * 0.08,
            }}
            whileHover={{ y: -10 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="relative"
            style={{ perspective: '1000px' }}
        >
            {/* Card glow aura */}
            <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                animate={{
                    boxShadow: hovered
                        ? isHighDemand
                            ? '0 0 50px rgba(225,29,72,0.15), 0 0 80px rgba(99,102,241,0.08)'
                            : '0 0 40px rgba(99,102,241,0.15), 0 0 60px rgba(99,102,241,0.05)'
                        : '0 0 0px transparent',
                }}
                transition={{ duration: 0.4 }}
            />

            {/* High demand badge */}
            {isHighDemand && <HighDemandBadge region={product.region} />}

            {/* Card body */}
            <div className="relative glass-panel rounded-3xl p-6 h-full flex flex-col overflow-hidden group">
                {/* Product image */}
                <div className="w-full flex justify-center mb-4">
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-28 h-28 object-contain rounded-2xl bg-black/30 border border-white/10 shadow-[0_0_18px_rgba(99,102,241,0.12)]"
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                </div>
                {/* Ambient gradient sweep on hover */}
                <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    animate={{
                        background: hovered
                            ? 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)'
                            : 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0) 0%, transparent 70%)',
                    }}
                    transition={{ duration: 0.5 }}
                />
                {/* High demand tint */}
                {isHighDemand && (
                    <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-b from-rose-900/10 to-transparent" />
                )}
                {/* Top row: category badge + shelf life */}
                <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-white/8 bg-white/[0.03] font-mono text-[10px] tracking-widest uppercase text-white/40">
                        {product.category}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-white/25 uppercase">
                        {Math.round(product.baseShelfLifeDays / 365)}yr shelf
                    </span>
                </div>
                {/* Product name */}
                <h3 className="text-white font-semibold text-base leading-snug tracking-tight mb-2">
                    {product.name}
                </h3>
                {/* Description */}
                <p className="text-white/35 text-xs leading-relaxed font-light mb-4 flex-1">
                    {product.description}
                </p>
                {/* SKU */}
                <span className="font-mono text-[10px] tracking-widest text-white/20 uppercase mb-4">
                    SKU · {product.sku}
                </span>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {product.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 rounded border border-white/[0.06] bg-white/[0.02] font-mono text-[9px] tracking-widest text-white/30 uppercase"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
                {/* Stock bar */}
                <StockBar stockCount={product.stockCount} maxStock={product.maxStock} />
                {/* Divider */}
                <div className="my-4 border-t border-white/[0.06]" />
                {/* Price + CTA */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase mb-0.5">Price</p>
                        <p className="text-white text-xl font-bold tracking-tight">
                            ₹{product.price.toLocaleString('en-IN')}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className={`relative px-4 py-2 rounded-xl text-xs font-semibold font-mono tracking-widest uppercase transition-all duration-200 ${isHighDemand
                                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 shadow-[0_0_14px_rgba(225,29,72,0.2)]'
                                : 'bg-violet-500/10 border border-violet-500/25 text-violet-300 hover:bg-violet-500/20 shadow-[0_0_14px_rgba(99,102,241,0.15)]'
                            }`}
                    >
                        {isHighDemand ? '⚡ Secure Now' : '+ Add to Kit'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = () => (
    <div className="mb-12">
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-tactical mb-3"
        >
            LifeShield · SCM Intelligence Layer · v2.4
        </motion.p>
        <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl font-bold tracking-tight text-white mb-4"
        >
            Demand-Aware{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Preparedness Catalog
            </span>
        </motion.h2>
        <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/40 text-sm max-w-lg leading-relaxed"
        >
            Our SCM engine monitors regional demand signals in real-time.{' '}
            <span className="text-rose-400/80">Surge-flagged items</span> are predicted to sell out within 24–72 hours. Prioritize accordingly.
        </motion.p>

        {/* Region Pill */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-500/20 bg-rose-500/[0.04] backdrop-blur-sm"
        >
            <PulsingDot />
            <span className="font-mono text-[11px] tracking-widest uppercase text-rose-400/80">
                Live Demand Signal · Maharashtra Region
            </span>
        </motion.div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProductCatalog() {
    const [filter, setFilter] = useState<'ALL' | 'HIGH'>('ALL');

    const displayed = filter === 'HIGH'
        ? MOCK_PRODUCTS.filter(p => p.demandVelocity === 'HIGH')
        : MOCK_PRODUCTS;

    return (
        <section className="relative min-h-screen bg-[#050505] px-6 py-20 overflow-hidden">

            {/* Atmosphere orbs */}
            <div className="bg-orb-violet w-[600px] h-[600px] -top-40 -left-40 opacity-30" />
            <div className="bg-orb-emerald w-[400px] h-[400px] top-1/2 -right-32 opacity-20" />
            <div className="absolute w-[300px] h-[300px] rounded-full bg-rose-900/15 blur-[100px] top-80 left-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <SectionHeader />

                {/* Filter Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-center gap-3 mb-10"
                >
                    <span className="font-mono text-[10px] tracking-widest text-white/25 uppercase mr-1">Filter:</span>
                    {(['ALL', 'HIGH'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all duration-200 border ${filter === f
                                    ? f === 'HIGH'
                                        ? 'border-rose-500/50 bg-rose-500/10 text-rose-300 shadow-[0_0_12px_rgba(225,29,72,0.2)]'
                                        : 'border-violet-500/40 bg-violet-500/10 text-violet-300'
                                    : 'border-white/10 bg-white/[0.02] text-white/30 hover:border-white/20 hover:text-white/50'
                                }`}
                        >
                            {f === 'HIGH' ? '🔥 Surge Items' : 'All Products'}
                        </button>
                    ))}
                    <span className="ml-auto font-mono text-[10px] tracking-widest text-white/20 uppercase">
                        {displayed.length} items
                    </span>
                </motion.div>

                {/* Grid */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={filter}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {displayed.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Footer meta */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 pt-6 border-t border-white/[0.04] flex items-center justify-between"
                >
                    <p className="font-mono text-[10px] tracking-widest text-white/15 uppercase">
                        LifeShield SCM · Data refreshed: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="font-mono text-[10px] tracking-widest text-white/15 uppercase">
                        Demand signals sourced from 14 regional nodes
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
