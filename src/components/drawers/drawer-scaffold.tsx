import type { BaseSyntheticEvent, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

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
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="top">
      <DrawerContent className="h-[100dvh] max-h-[100dvh]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-[max(8px,env(safe-area-inset-bottom))]">
          {children}
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
        </div>
      </DrawerContent>
    </Drawer>
  );
}
