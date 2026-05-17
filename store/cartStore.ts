import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const existingItem = get().items.find(
          (item) =>
            item.productId === newItem.productId && item.size === newItem.size
        );

        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.productId === newItem.productId && item.size === newItem.size
                ? { ...item, qty: item.qty + newItem.qty }
                : item
            ),
          });
        } else {
          set({ items: [...get().items, newItem] });
        }
      },
      removeItem: (productId, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.productId === productId && item.size === size)
          ),
        });
      },
      updateQty: (productId, size, qty) => {
        if (qty <= 0) {
          get().removeItem(productId, size);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, qty }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.qty, 0);
      },
      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.qty,
          0
        );
      },
    }),
    {
      name: "lavender-umbra-cart",
    }
  )
);
