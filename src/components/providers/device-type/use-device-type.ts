import { useContext } from 'react';

import { DeviceTypeProviderContext } from './device-type-context';

export function useDeviceType() {
  const context = useContext(DeviceTypeProviderContext);

  if (context === undefined) {
    throw new Error('useDeviceType must be used within a DeviceTypeProvider');
  }

  return context;
}
