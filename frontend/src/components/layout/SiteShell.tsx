'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { hydrateCart } from '@/lib/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

export default function SiteShell({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);

    useEffect(() => {
        dispatch(hydrateCart());
    }, [dispatch]);

    const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

    return (
        <>
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="bg-orb-emerald w-[500px] h-[500px] top-[-10%] left-[-10%] opacity-50" />
                <div className="bg-orb-violet w-[600px] h-[600px] bottom-[-20%] right-[-10%] opacity-45" />
            </div>

            <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/10 px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold tracking-[0.2em] uppercase text-white/90">
                    LIFESHIELD
                </Link>
                <div className="flex gap-5 text-tactical items-center">
                    <Link href="/products" className="hover:text-white/90 transition-colors">Catalog</Link>
                    <Link href="/dashboard" className="hover:text-white/90 transition-colors">Dashboard</Link>
                    <Link href="/cart" className="hover:text-white/90 transition-colors">Cart ({cartCount})</Link>
                    <Link href="/login" className="hover:text-white/90 transition-colors">Login</Link>
                    <Link href="/signup" className="hover:text-white/90 transition-colors">Signup</Link>
                    <Link href="/products" className="hud-button px-4 py-2 rounded-2xl cursor-pointer hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]">
                        Shop Now
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 pt-24 px-6 md:px-12 lg:px-20">
                {children}
            </main>
        </>
    );
}
