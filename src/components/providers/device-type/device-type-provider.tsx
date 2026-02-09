import { type ReactNode, useMemo, useSyncExternalStore } from 'react';

import {
  type DeviceType,
  DeviceTypeProviderContext,
  type DeviceTypeProviderState,
} from './device-type-context';

const TABLET_MIN_WIDTH = 768;
const PC_MIN_WIDTH = 1024;

/** Lightweight matchMedia hook — replaces react-responsive dependency. */
function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    cb => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

interface DeviceTypeProviderProps {
  children: ReactNode;
}

export function DeviceTypeProvider({ children }: DeviceTypeProviderProps) {
  const isPc = useMediaQuery(`(min-width: ${PC_MIN_WIDTH}px)`);
  const isTablet = useMediaQuery(
    `(min-width: ${TABLET_MIN_WIDTH}px) and (max-width: ${PC_MIN_WIDTH - 1}px)`
  );

  let deviceType: DeviceType = 'phone';
  if (isPc) {
    deviceType = 'pc';
  } else if (isTablet) {
    deviceType = 'tablet';
  }

  const value: DeviceTypeProviderState = useMemo(
    () => ({
      deviceType,
      isPhone: deviceType === 'phone',
      isTablet: deviceType === 'tablet',
      isPc: deviceType === 'pc',
    }),
    [deviceType]
  );

  return (
    <DeviceTypeProviderContext.Provider value={value}>
      {children}
    </DeviceTypeProviderContext.Provider>
  );
}
