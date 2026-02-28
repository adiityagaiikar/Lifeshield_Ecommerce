'use client';

import React, { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    accent?: 'emerald' | 'violet' | 'white';
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = '',
    onClick,
    accent = 'emerald'
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX, clientY } = e;
        if (buttonRef.current) {
            const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
            const middleX = clientX - (left + width / 2);
            const middleY = clientY - (top + height / 2);
            setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
        }
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const getAccentClass = () => {
        switch (accent) {
            case 'emerald':
                return 'bg-indigo-600/20 hover:bg-indigo-500/30 border-indigo-500/50 text-indigo-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]';
            case 'violet':
                return 'bg-violet-600/20 hover:bg-violet-500/30 border-violet-500/50 text-violet-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]';
            default:
                return 'bg-white/5 hover:bg-white/10 border-white/20 text-white/90 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]';
        }
    };

    return (
        <motion.button
            ref={buttonRef}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, mass: 0.5 }}
            onClick={onClick}
            className={`px-8 py-4 uppercase tracking-[0.2em] text-xs font-mono font-bold border rounded-2xl transition-all duration-300 ${getAccentClass()} ${className}`}
        >
            {children}
        </motion.button>
    );
};

export default MagneticButton;
