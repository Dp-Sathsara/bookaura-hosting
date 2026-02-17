import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ✅ Checkout Page එකට ඕන කරන Book Interface එක මෙතන තියෙනවා
export interface Book {
    id: number | string; // ID එක number හෝ string වෙන්න පුළුවන්
    title: string;
    author: string;
    price: number;
    image: string;
    category?: string;
    rating?: number;
    quantity?: number; // ✅ අනිවාර්යයෙන්ම මේක තියෙන්න ඕනේ Checkout එකට
}

interface AppState {
    cart: Book[];
    wishlist: Book[];

    // Actions
    addToCart: (book: Book) => void;
    removeFromCart: (id: number | string) => void;
    clearCart: () => void;

    addToWishlist: (book: Book) => void;
    removeFromWishlist: (id: number | string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            cart: [],
            wishlist: [],

            addToCart: (book) => set((state) => {
                const existingItem = state.cart.find((b) => b.id === book.id);

                if (existingItem) {
                    // දැනටමත් Cart එකේ තියෙනවා නම් Quantity එක වැඩි කරනවා
                    return {
                        cart: state.cart.map((b) =>
                            b.id === book.id
                                ? { ...b, quantity: (b.quantity || 1) + 1 }
                                : b
                        ),
                    };
                }

                // අලුත් අයිටම් එකක් නම් Quantity 1 දාලා Add කරනවා
                return {
                    cart: [...state.cart, { ...book, quantity: 1 }]
                };
            }),

            removeFromCart: (id) => set((state) => ({
                cart: state.cart.filter((b) => b.id !== id)
            })),

            clearCart: () => set({ cart: [] }),

            addToWishlist: (book) => set((state) => {
                const exists = state.wishlist.find((b) => b.id === book.id);
                if (exists) return state;
                return { wishlist: [...state.wishlist, book] };
            }),

            removeFromWishlist: (id) => set((state) => ({
                wishlist: state.wishlist.filter((b) => b.id !== id)
            })),
        }),
        {
            name: 'bookflow-cart-storage', // LocalStorage Key Name
            storage: createJSONStorage(() => localStorage),
        }
    )
);