import { X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DetailPanel({
  isOpen,
  onClose,
  title,
  children,
  className,
}: DetailPanelProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
        <SheetContent side="right" className="w-full p-0 sm:w-96">
          <SheetHeader className="border-b p-4">
            <SheetTitle className="pr-8">{title}</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="p-4">{children}</div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  if (!isOpen) return null;

  return (
    <aside
      className={cn(
        'bg-background flex w-96 shrink-0 flex-col border-l',
        className
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="truncate pr-2 text-lg font-semibold">{title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">{children}</div>
      </ScrollArea>
    </aside>
  );
}
