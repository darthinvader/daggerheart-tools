import { useMediaQuery } from 'react-responsive';

import { type ReactNode } from 'react';

import {
  type DeviceType,
  DeviceTypeProviderContext,
  type DeviceTypeProviderState,
} from './device-type-context';

type DeviceTypeProviderProps = {
  children: ReactNode;
};

// Define breakpoints
const TABLET_MIN_WIDTH = 768;
const PC_MIN_WIDTH = 1024;

export function DeviceTypeProvider({ children }: DeviceTypeProviderProps) {
  // We use useMediaQuery to track the state.
  // Note: react-responsive handles the listeners and updates automatically.

  const isPc = useMediaQuery({ minWidth: PC_MIN_WIDTH });
  const isTablet = useMediaQuery({
    minWidth: TABLET_MIN_WIDTH,
    maxWidth: PC_MIN_WIDTH - 1,
  });
  // We can infer phone if neither PC nor Tablet, or explicitly check:
  // const isPhone = useMediaQuery({ maxWidth: TABLET_MIN_WIDTH - 1 });

  // Determine the single "current" device type.
  // Priority: PC > Tablet > Phone (though ranges are exclusive above, so it shouldn't overlap)
  let deviceType: DeviceType = 'phone';
  if (isPc) {
    deviceType = 'pc';
  } else if (isTablet) {
    deviceType = 'tablet';
  } else {
    deviceType = 'phone';
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
