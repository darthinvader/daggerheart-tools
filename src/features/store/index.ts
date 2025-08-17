import { create } from 'zustand';

type UIState = {
  // how many inventory items to show initially for large lists (chunk rendering)
  inventoryShowCount: number;
};

type UIActions = {
  setInventoryShowCount: (n: number) => void;
};

type Store = UIState & UIActions;

export const useAppStore = create<Store>(set => ({
  inventoryShowCount: 200,
  setInventoryShowCount: n => set({ inventoryShowCount: Math.max(0, n) }),
}));
