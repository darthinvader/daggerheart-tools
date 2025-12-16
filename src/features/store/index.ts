import { Store, useStore } from '@tanstack/react-store';

interface UIState {
  inventoryShowCount: number;
}

const appStore = new Store<UIState>({ inventoryShowCount: 200 });

export function useAppStore<T>(selector: (state: UIState) => T): T {
  return useStore(appStore, selector);
}

export const appActions = {
  setInventoryShowCount: (n: number) =>
    appStore.setState(s => ({ ...s, inventoryShowCount: Math.max(0, n) })),
};

export { appStore };
