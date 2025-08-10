import type { BaseSyntheticEvent, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
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
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="h-[100dvh] max-h-[100dvh]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
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
        <DrawerFooter>
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
