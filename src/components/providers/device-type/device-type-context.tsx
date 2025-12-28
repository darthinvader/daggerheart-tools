import { createContext, useContext } from 'react';

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

export function useDeviceType() {
  const context = useContext(DeviceTypeProviderContext);

  if (context === undefined) {
    throw new Error('useDeviceType must be used within a DeviceTypeProvider');
  }

  return context;
}
