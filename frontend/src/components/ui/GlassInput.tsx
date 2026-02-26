import React from 'react';
import { Search } from 'lucide-react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: boolean;
    className?: string;
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
    ({ icon = false, className = '', ...props }, ref) => {
        return (
            <div className={`relative ${className}`}>
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={18} strokeWidth={1.5} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`w-full bg-surface-glass backdrop-blur-md border border-white/5 rounded-sm p-4 text-white focus:outline-none focus:border-primary-emerald/50 focus:shadow-glow-emerald transition-all duration-300 placeholder-gray-500 font-mono text-sm tracking-wider ${icon ? 'pl-12' : ''
                        }`}
                    {...props}
                />
            </div>
        );
    }
);

GlassInput.displayName = 'GlassInput';

export default GlassInput;
