import React, { type BaseSyntheticEvent, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

export type DrawerScaffoldProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  children: ReactNode;
  onCancel: () => void;
  onSubmit: (e?: BaseSyntheticEvent) => void | Promise<void>;
  submitLabel?: string;
  submitting?: boolean;
  submitDisabled?: boolean;
  footer?: ReactNode; // optional custom footer overrides default actions
};

export function DrawerScaffold({
  open,
  onOpenChange,
  title,
  children,
  onCancel,
  onSubmit,
  submitLabel = 'Save',
  submitting,
  submitDisabled,
  footer,
}: DrawerScaffoldProps) {
  // When closing, prevent new scroll input & momentum from fighting the close animation
  const scrollBehaviorClass = open
    ? ''
    : 'pointer-events-none touch-none overflow-hidden';
  const descriptionId = React.useId();
  // Track history state pushed for this drawer session to intercept back button
  const pushedRef = React.useRef(false);
  const closingByPopRef = React.useRef(false);
  const popHandlerRef = React.useRef<((e: PopStateEvent) => void) | null>(null);
  // Push a history state when opening so a single Back closes the drawer
  React.useEffect(() => {
    if (open && !pushedRef.current && typeof window !== 'undefined') {
      try {
        window.history.pushState({ __drawer__: true }, '');
        pushedRef.current = true;
        const handler = () => {
          // When user presses back, close the drawer instead of navigating away
          closingByPopRef.current = true;
          onOpenChange(false);
        };
        popHandlerRef.current = handler as unknown as (
          e: PopStateEvent
        ) => void;
        window.addEventListener('popstate', handler as EventListener);
      } catch {
        // ignore history errors (older browsers or restricted environments)
      }
    }
    // When closing via UI, consume our pushed state to keep history clean
    if (!open && pushedRef.current && typeof window !== 'undefined') {
      try {
        // Remove listener before navigating back to avoid double-calls
        if (popHandlerRef.current) {
          window.removeEventListener(
            'popstate',
            popHandlerRef.current as unknown as EventListener
          );
        }
        popHandlerRef.current = null;
        // Only navigate back if this close was not initiated by a popstate event
        if (!closingByPopRef.current) {
          window.history.back();
        }
        // Reset flags after consuming state
        pushedRef.current = false;
        closingByPopRef.current = false;
      } catch {
        // ignore
      }
    }
    return () => {
      // Cleanup listeners if component unmounts while drawer open
      if (popHandlerRef.current) {
        window.removeEventListener(
          'popstate',
          popHandlerRef.current as unknown as EventListener
        );
        popHandlerRef.current = null;
      }
    };
  }, [open, onOpenChange]);
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent
        className="h-[100dvh] max-h-[100dvh]"
        aria-describedby={descriptionId}
      >
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        {/* Provide a generic description for a11y; callers can override by rendering their own header copy later if needed */}
        <DrawerDescription id={descriptionId} className="sr-only">
          Navigate between sections by swiping or scrolling horizontally. Make a
          selection and choose Save to apply changes.
        </DrawerDescription>
        <div
          // Mark as scrollable so Vaul won't treat fast scrolls as a drag-to-close
          data-vaul-scrollable
          className={cn(
            'min-h-0 flex-1 [touch-action:pan-y] overflow-y-auto [overscroll-behavior:contain] px-4 [-webkit-overflow-scrolling:touch]',
            scrollBehaviorClass
          )}
        >
          {children}
        </div>
        <DrawerFooter className="pb-[max(env(safe-area-inset-bottom),0px)]">
          {footer ?? (
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || submitDisabled}
                onClick={onSubmit}
              >
                {submitLabel}
              </Button>
            </div>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
