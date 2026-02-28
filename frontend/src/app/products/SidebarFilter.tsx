import React from 'react';
import { Filter, SlidersHorizontal, PackageSearch } from 'lucide-react';

interface SidebarFilterProps {
    categories: string[];
    selectedCategory: string;
    stockFilter: 'all' | 'in-stock';
    onCategoryChange: (category: string) => void;
    onStockFilterChange: (value: 'all' | 'in-stock') => void;
    onReset: () => void;
}

const SidebarFilter = ({
    categories,
    selectedCategory,
    stockFilter,
    onCategoryChange,
    onStockFilterChange,
    onReset,
}: SidebarFilterProps) => {
    return (
        <div className="w-full md:w-64 flex-shrink-0 glass-panel p-6 sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex items-center gap-2 mb-8 text-tactical">
                <SlidersHorizontal size={14} />
                <span>[ TACTICAL FILTERS ]</span>
            </div>

            <div className="mb-8 border-b border-white/10 pb-6">
                <h4 className="text-white/90 font-bold mb-4 flex items-center gap-2 text-tactical">
                    <Filter size={16} className="text-primary-emerald" /> CATEGORY
                </h4>
                <div className="flex flex-col gap-3 text-sm text-gray-400">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-white/90 transition-colors">
                        <input
                            type="radio"
                            name="category"
                            className="accent-primary-emerald bg-transparent border-white/20"
                            checked={selectedCategory === ''}
                            onChange={() => onCategoryChange('')}
                        />
                        All Categories
                    </label>
                    {categories.map((category) => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer hover:text-white/90 transition-colors">
                            <input
                                type="radio"
                                name="category"
                                className="accent-primary-emerald"
                                checked={selectedCategory === category}
                                onChange={() => onCategoryChange(category)}
                            />
                            {category}
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-8 border-b border-white/10 pb-6">
                <h4 className="text-white/90 font-bold mb-4 flex items-center gap-2 text-tactical">
                    <PackageSearch size={16} className="text-primary-violet" /> STOCK STATUS
                </h4>
                <div className="flex flex-col gap-3 text-sm text-gray-400">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-white/90 transition-colors">
                        <input
                            type="radio"
                            name="stock"
                            className="accent-primary-violet bg-transparent border-white/20"
                            checked={stockFilter === 'all'}
                            onChange={() => onStockFilterChange('all')}
                        />
                        All Deployment Assets
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-white/90 transition-colors">
                        <input
                            type="radio"
                            name="stock"
                            className="accent-primary-violet bg-transparent border-white/20"
                            checked={stockFilter === 'in-stock'}
                            onChange={() => onStockFilterChange('in-stock')}
                        />
                        Ready to Deploy (In Stock)
                    </label>
                </div>
            </div>

            <button
                type="button"
                className="w-full hud-button py-2 rounded-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]"
                onClick={onReset}
            >
                Reset Filters
            </button>
        </div>
    );
};

export default SidebarFilter;
