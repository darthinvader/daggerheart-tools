import { useMediaQuery } from 'react-responsive';

import type { ReactNode } from 'react';

import {
  type DeviceType,
  DeviceTypeProviderContext,
  type DeviceTypeProviderState,
} from './device-type-context';

const TABLET_MIN_WIDTH = 768;
const PC_MIN_WIDTH = 1024;

interface DeviceTypeProviderProps {
  children: ReactNode;
}

export function DeviceTypeProvider({ children }: DeviceTypeProviderProps) {
  const isPc = useMediaQuery({ minWidth: PC_MIN_WIDTH });
  const isTablet = useMediaQuery({
    minWidth: TABLET_MIN_WIDTH,
    maxWidth: PC_MIN_WIDTH - 1,
  });

  let deviceType: DeviceType = 'phone';
  if (isPc) {
    deviceType = 'pc';
  } else if (isTablet) {
    deviceType = 'tablet';
  }

  const value: DeviceTypeProviderState = {
    deviceType,
    isPhone: deviceType === 'phone',
    isTablet: deviceType === 'tablet',
    isPc: deviceType === 'pc',
  };

  return (
    <DeviceTypeProviderContext.Provider value={value}>
      {children}
    </DeviceTypeProviderContext.Provider>
  );
}
