import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Book {
  id: number | string;
  title: string;
  author: string;
  price: number;
  image: string;
}

interface CartItem extends Book {
  quantity: number;
  selected: boolean;
}

interface Order {
  orderId: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: "Processing" | "Shipped" | "Delivered";
}

interface CartStore {
  cart: CartItem[];
  orders: Order[];
  addToCart: (book: Book, qty?: number) => void;
  removeFromCart: (id: number | string) => void;
  removeItemCompletely: (id: number | string) => void;
  toggleSelectItem: (id: number | string) => void;
  toggleSelectAll: (isSelected: boolean) => void;
  clearSelectedItems: () => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  // ✅ අලුතින් එකතු කළ කොටස: Order Status එක වෙනස් කිරීමට
  updateOrderStatus: (orderId: string, newStatus: "Processing" | "Shipped" | "Delivered") => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      orders: [],

      addToCart: (book, qty = 1) => {
        const currentCart = get().cart;
        const isBookInCart = currentCart.find((item) => item.id === book.id);

        if (isBookInCart) {
          set({
            cart: currentCart.map((item) =>
              item.id === book.id ? { ...item, quantity: item.quantity + qty } : item
            ),
          });
        } else {
          set({ cart: [...currentCart, { ...book, quantity: qty, selected: true }] });
        }
      },

      toggleSelectItem: (id) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === id ? { ...item, selected: !item.selected } : item
        )
      })),

      toggleSelectAll: (isSelected) => set((state) => ({
        cart: state.cart.map((item) => ({ ...item, selected: isSelected }))
      })),

      clearSelectedItems: () => set((state) => ({
        cart: state.cart.filter((item) => !item.selected)
      })),

      removeFromCart: (id) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((item) => item.id === id);

        if (existingItem && existingItem.quantity > 1) {
          set({
            cart: currentCart.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            ),
          });
        } else {
          set({ cart: currentCart.filter((item) => item.id !== id) });
        }
      },

      removeItemCompletely: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      clearCart: () => set({ cart: [] }),

      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders]
      })),

      // ✅ ලැබෙන Order ID එක අනුව Status එක පමණක් මාරු කරන Logic එක
      updateOrderStatus: (orderId, newStatus) => set((state) => ({
        orders: state.orders.map((order) =>
          order.orderId === orderId ? { ...order, status: newStatus } : order
        )
      })),

      totalPrice: () => {
        return get().cart
          .filter(item => item.selected)
          .reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'user-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);