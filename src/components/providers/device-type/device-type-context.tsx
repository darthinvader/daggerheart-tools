import { createContext } from 'react';

export type DeviceType = 'phone' | 'tablet' | 'pc';

export interface DeviceTypeProviderState {
  deviceType: DeviceType;
  isPhone: boolean;
  isTablet: boolean;
  isPc: boolean;
}

export const DeviceTypeProviderContext = createContext<
  DeviceTypeProviderState | undefined
>(undefined);
