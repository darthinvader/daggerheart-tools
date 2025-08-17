/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

import './sidebar.css';

export const SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_WIDTH_ICON = '3rem';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

export type SidebarContextProps = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  // Minimal CookieStore typing to avoid any
  type CookieStoreLike =
    | {
        set?: (opts: {
          name: string;
          value: string;
          path?: string;
          expires?: number | Date;
        }) => Promise<void> | void;
      }
    | undefined;
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  // Initialize from Cookie Store API or localStorage to persist across reloads
  const initialOpen = React.useMemo(() => {
    try {
      // Prefer Cookie Store API when available (modern browsers)
      // Note: cookieStore is async; for init we read from localStorage instead
      const persisted = localStorage.getItem(SIDEBAR_COOKIE_NAME);
      if (persisted === 'true') return true;
      if (persisted === 'false') return false;
    } catch {
      // ignore
      void 0;
    }
    return defaultOpen;
  }, [defaultOpen]);
  const [_open, _setOpen] = React.useState(initialOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) setOpenProp(openState);
      else _setOpen(openState);
      // Persist using Cookie Store API if available, else fallback to localStorage
      try {
        const cs = (globalThis as unknown as { cookieStore?: CookieStoreLike })
          .cookieStore;
        if (cs?.set) {
          cs.set({
            name: SIDEBAR_COOKIE_NAME,
            value: String(openState),
            path: '/',
            expires: Date.now() + SIDEBAR_COOKIE_MAX_AGE * 1000,
          });
        } else {
          localStorage.setItem(SIDEBAR_COOKIE_NAME, String(openState));
        }
      } catch {
        // Ignore persistence failures
        void 0;
      }
    },
    [setOpenProp, open]
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile(open => !open) : setOpen(open => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div data-slot="sidebar-wrapper" className={className} {...props}>
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}
