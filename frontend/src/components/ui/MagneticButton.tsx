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

    const getShadowColor = () => {
        switch (accent) {
            case 'emerald': return 'hover:shadow-glow-emerald';
            case 'violet': return 'hover:shadow-glow-violet';
            default: return 'hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]';
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
            className={`glass-panel px-8 py-4 font-mono uppercase tracking-widest text-sm text-white rounded-sm transition-shadow duration-500 ${getShadowColor()} ${className}`}
        >
            {children}
        </motion.button>
    );
};

export default MagneticButton;
