import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  autoSaveOnClose?: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
  mode?: 'pc' | 'tablet' | 'phone';
  saveLabel?: string;
  closeLabel?: string;
}

const MODE_CLASSES = {
  pc: 'sm:max-w-[800px]',
  tablet: 'sm:max-w-[500px]',
  phone: 'sm:max-w-[350px] w-full',
} as const;

export function ResponsiveModal({
  isOpen,
  onClose,
  onSave,
  autoSaveOnClose = false,
  title,
  description,
  children,
  mode = 'pc',
  saveLabel = 'Save',
  closeLabel = 'Close',
}: ResponsiveModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (autoSaveOnClose) {
        onSave();
      }
      onClose();
    }
  };

  const handleFooterClose = () => {
    onClose();
  };

  const handleFooterSave = () => {
    onSave();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          'grid h-full w-full grid-rows-[auto_1fr_auto] gap-0 p-0 sm:h-auto sm:max-h-[90vh]',
          MODE_CLASSES[mode]
        )}
      >
        <DialogHeader className="shrink-0 p-6 pb-4">
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-2">{children}</div>

        <div className="flex shrink-0 flex-col-reverse gap-2 p-6 pt-4 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={handleFooterClose}>
            {closeLabel}
          </Button>
          <Button onClick={handleFooterSave}>{saveLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
