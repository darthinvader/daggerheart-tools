'use client';

import * as React from 'react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

/**
 * A responsive sheet component that uses Drawer (vaul) on mobile
 * for better touch performance, and Sheet (Radix) on desktop.
 *
 * Vaul is specifically optimized for mobile touch interactions and
 * avoids the performance issues with Radix Dialog on mobile devices.
 */
function ResponsiveSheet({
  open,
  onOpenChange,
  children,
}: ResponsiveSheetProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {children}
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children}
    </Sheet>
  );
}

interface ResponsiveSheetContentProps {
  children: React.ReactNode;
  className?: string;
  /** Side for desktop Sheet (ignored on mobile which uses bottom drawer) */
  side?: 'right' | 'left';
  hideCloseButton?: boolean;
}

/**
 * Content component that renders DrawerContent on mobile and SheetContent on desktop.
 * On mobile, always renders as a bottom drawer for native-feeling interactions.
 */
function ResponsiveSheetContent({
  children,
  className,
  side = 'right',
  hideCloseButton = false,
}: ResponsiveSheetContentProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerContent className={className}>{children}</DrawerContent>;
  }

  return (
    <SheetContent
      side={side}
      className={className}
      hideCloseButton={hideCloseButton}
    >
      {children}
    </SheetContent>
  );
}

function ResponsiveSheetHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerHeader className={className} {...props} />;
  }

  return <SheetHeader className={className} {...props} />;
}

function ResponsiveSheetFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerFooter className={className} {...props} />;
  }

  return <SheetFooter className={className} {...props} />;
}

function ResponsiveSheetTitle({
  className,
  ...props
}: React.ComponentProps<'h2'>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerTitle className={className} {...props} />;
  }

  return <SheetTitle className={className} {...props} />;
}

function ResponsiveSheetDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerDescription className={className} {...props} />;
  }

  return <SheetDescription className={className} {...props} />;
}

function ResponsiveSheetClose({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <DrawerClose className={className} {...props} />;
  }

  return <SheetClose className={className} {...props} />;
}

export {
  ResponsiveSheet,
  ResponsiveSheetClose,
  ResponsiveSheetContent,
  ResponsiveSheetDescription,
  ResponsiveSheetFooter,
  ResponsiveSheetHeader,
  ResponsiveSheetTitle,
};
