import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    stock: number;
}

interface CartState {
    items: CartItem[];
}

const STORAGE_KEY = 'lifeshield_cart';

const loadCart = (): CartItem[] => {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const persistCart = (items: CartItem[]) => {
    if (typeof window === 'undefined') {
        return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const initialState: CartState = {
    items: loadCart(),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        hydrateCart(state) {
            state.items = loadCart();
        },
        addToCart(state, action: PayloadAction<CartItem>) {
            const incoming = action.payload;
            const existing = state.items.find((item) => item.productId === incoming.productId);

            if (existing) {
                existing.quantity = Math.min(existing.quantity + incoming.quantity, existing.stock);
            } else {
                state.items.push(incoming);
            }

            persistCart(state.items);
        },
        updateCartQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
            const target = state.items.find((item) => item.productId === action.payload.productId);
            if (!target) {
                return;
            }

            target.quantity = Math.max(1, Math.min(action.payload.quantity, target.stock));
            persistCart(state.items);
        },
        removeFromCart(state, action: PayloadAction<string>) {
            state.items = state.items.filter((item) => item.productId !== action.payload);
            persistCart(state.items);
        },
        clearCart(state) {
            state.items = [];
            persistCart(state.items);
        },
    },
});

export const { hydrateCart, addToCart, updateCartQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
