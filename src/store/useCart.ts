import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Service } from '@/lib/queries';

export interface CartItem extends Service {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (service: Service) => void;
  removeItem: (serviceId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (service) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === service.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === service.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...service, quantity: 1 }] };
        });
      },
      removeItem: (serviceId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== serviceId),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: 'heptome-cart', // local storage key
    }
  )
);
