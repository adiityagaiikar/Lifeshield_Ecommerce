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
                    className={`w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-4 text-white/90 focus:outline-none focus:border-indigo-400/60 focus:shadow-[0_0_40px_rgba(99,102,241,0.15)] transition-all duration-300 placeholder-gray-400 font-mono uppercase tracking-[0.2em] text-xs font-bold ${icon ? 'pl-12' : ''
                        }`}
                    {...props}
                />
            </div>
        );
    }
);

GlassInput.displayName = 'GlassInput';

export default GlassInput;
