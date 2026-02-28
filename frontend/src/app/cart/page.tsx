'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { clearCart, removeFromCart, updateCartQuantity } from '@/lib/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

export default function CartPage() {
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.cart.items);

    const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items]);
    const shipping = subtotal > 0 ? 49 : 0;
    const total = subtotal + shipping;

    const checkout = async () => {
        try {
            await api.post('/cart/checkout', {
                shippingAddress: {
                    address: 'Demo Address',
                    city: 'Demo City',
                    postalCode: '000000',
                    country: 'India',
                },
                paymentMethod: 'COD',
            });
            dispatch(clearCart());
            alert('Order placed successfully.');
        } catch {
            alert('Please login before checkout.');
        }
    };

    if (!items.length) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <div className="glass-panel p-10 text-center">
                    <h1 className="text-3xl font-black text-white/90">Your cart is empty</h1>
                    <p className="text-tactical mt-3">Add products from the catalog to continue.</p>
                    <Link href="/products" className="inline-block mt-6 hud-button px-5 py-3 rounded-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24">
            <div className="lg:col-span-2 glass-panel p-5">
                <h1 className="text-3xl font-black text-white/90 mb-5">Shopping Cart</h1>

                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.productId} className="border border-white/10 bg-white/[0.03] rounded-2xl p-4 grid grid-cols-[88px_1fr_auto] gap-4 items-center">
                            <div className="relative w-[88px] h-[88px] rounded-2xl overflow-hidden border border-white/10">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>

                            <div>
                                <Link href={`/products/${item.productId}`} className="font-semibold text-white/90 hover:underline">
                                    {item.name}
                                </Link>
                                <p className="text-sm text-gray-400 mt-1">₹{item.price.toFixed(2)} each</p>
                                <div className="mt-3 flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="border border-white/10 bg-white/[0.03] px-2 py-1 text-sm text-white/90 rounded-xl"
                                        onClick={() => dispatch(updateCartQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                                    >
                                        -
                                    </button>
                                    <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                                    <button
                                        type="button"
                                        className="border border-white/10 bg-white/[0.03] px-2 py-1 text-sm text-white/90 rounded-xl"
                                        onClick={() => dispatch(updateCartQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                                    >
                                        +
                                    </button>
                                    <button
                                        type="button"
                                        className="text-sm text-red-600 ml-3"
                                        onClick={() => dispatch(removeFromCart(item.productId))}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            <div className="font-mono text-white/90 text-right">
                                ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-panel p-5 h-fit sticky top-28">
                <h2 className="text-xl font-bold text-white/90">Order Summary</h2>
                <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-400"><span>Shipping</span><span>₹{shipping.toFixed(2)}</span></div>
                    <div className="border-t border-white/10 pt-3 flex justify-between font-semibold text-white/90">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>

                <button type="button" className="w-full mt-5 hud-button py-3 rounded-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]" onClick={checkout}>
                    Buy Now
                </button>
            </div>
        </div>
    );
}
