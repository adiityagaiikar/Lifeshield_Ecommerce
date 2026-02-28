'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface AccordionItem {
    title: string;
    content: string | React.ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="flex flex-col gap-2">
            {items.map((item, index) => {
                const isOpen = expandedIndex === index;
                return (
                    <div key={index} className="glass-panel rounded-sm overflow-hidden">
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex justify-between items-center p-4 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                        >
                            <span className="uppercase tracking-[0.2em] text-xs font-mono font-bold text-gray-400">
                                {item.title}
                            </span>
                            <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-primary-emerald"
                            >
                                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                            </motion.div>
                        </button>
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    initial="collapsed"
                                    animate="open"
                                    exit="collapsed"
                                    variants={{
                                        open: { opacity: 1, height: 'auto' },
                                        collapsed: { opacity: 0, height: 0 }
                                    }}
                                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                >
                                    <div className="p-4 text-gray-400 text-sm leading-relaxed border-t border-white/10">
                                        {item.content}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};

export default Accordion;
