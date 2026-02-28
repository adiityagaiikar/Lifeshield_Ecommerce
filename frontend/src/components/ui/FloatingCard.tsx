'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FloatingCardProps {
    children?: ReactNode;
    className?: string;
    imageSrc?: string;
    title?: string;
    subtitle?: string;
    delay?: number;
}

const FloatingCard: React.FC<FloatingCardProps> = ({
    children,
    className = '',
    imageSrc,
    title,
    subtitle,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
                delay: delay
            }}
            whileHover={{ scale: 1.02, y: -8 }}
            className={`glass-panel overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] cursor-pointer group ${className}`}
        >
            {imageSrc && (
                <div className="relative w-full h-48 md:h-64 overflow-hidden bg-[#0f1118]">
                    <img
                        src={imageSrc}
                        alt={title || 'Product Image'}
                        className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                </div>
            )}

            {(title || subtitle) && (
                <div className="p-6 flex flex-col gap-2">
                    {subtitle && <span className="text-tactical">{subtitle}</span>}
                    {title && <h3 className="text-2xl font-bold tracking-tight text-white/90">{title}</h3>}
                </div>
            )}

            {children && (
                <div className="p-6 pt-0 flex-grow flex flex-col justify-end">
                    {children}
                </div>
            )}
        </motion.div>
    );
};

export default FloatingCard;
