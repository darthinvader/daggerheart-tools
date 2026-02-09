import type { LucideIcon } from 'lucide-react';
import { Pencil } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface EditableSectionProps {
  title: string;
  emoji?: string;
  icon?: LucideIcon;
  description?: string;
  children: ReactNode;
  isEditing: boolean;
  onEditToggle: () => void;
  editContent: ReactNode;
  editTitle?: string;
  editDescription?: string;
  modalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showEditButton?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  canSave?: boolean;
}

const MODAL_SIZE_CLASSES = {
  sm: 'w-[95vw] sm:max-w-md',
  md: 'w-[95vw] sm:max-w-xl',
  lg: 'w-[98vw] sm:max-w-4xl',
  xl: 'w-[98vw] sm:max-w-5xl lg:max-w-6xl',
  full: 'w-[98vw] sm:max-w-[95vw] lg:max-w-7xl',
} as const;

export function EditableSection({
  title,
  emoji,
  icon: Icon,
  description,
  children,
  isEditing,
  onEditToggle,
  editContent,
  editTitle,
  editDescription,
  modalSize = 'lg',
  className,
  showEditButton = true,
  onSave,
  onCancel,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  canSave = true,
}: EditableSectionProps) {
  const isMobile = useIsMobile();

  const handleCancel = () => {
    onCancel?.();
    onEditToggle();
  };

  const handleSave = () => {
    onSave?.();
    onEditToggle();
  };

  return (
    <>
      <section
        className={cn(
          'bg-card hover:border-primary/20 rounded-xl border shadow-sm transition-colors',
          className
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            {Icon ? (
              <Icon className="size-5" />
            ) : (
              emoji && <span className="text-xl">{emoji}</span>
            )}
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          {showEditButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditToggle}
              className="gap-2"
            >
              <Pencil className="size-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          )}
        </div>

        {description && (
          <p className="text-muted-foreground border-b px-4 py-2 text-sm sm:px-6">
            {description}
          </p>
        )}

        <div className="p-4 sm:p-6">{children}</div>
      </section>

      {isEditing &&
        (isMobile ? (
          <Drawer
            open={isEditing}
            onOpenChange={open => !open && handleCancel()}
          >
            <DrawerContent className="flex max-h-[85vh] flex-col">
              <DrawerHeader>
                <DrawerTitle className="flex items-center gap-2">
                  {Icon ? (
                    <Icon className="size-5" />
                  ) : (
                    emoji && <span>{emoji}</span>
                  )}
                  {editTitle ?? `Edit ${title}`}
                </DrawerTitle>
                {editDescription && (
                  <DrawerDescription>{editDescription}</DrawerDescription>
                )}
              </DrawerHeader>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                {editContent}
              </div>

              <DrawerFooter className="border-t pt-4">
                <Button onClick={handleSave} disabled={!canSave}>
                  {saveLabel}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  {cancelLabel}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog
            open={isEditing}
            onOpenChange={open => !open && handleCancel()}
          >
            <DialogContent
              className={cn(
                'grid h-full w-full grid-rows-[auto_1fr_auto] gap-0 overflow-hidden p-0 sm:h-auto sm:max-h-[90vh]',
                MODAL_SIZE_CLASSES[modalSize]
              )}
            >
              <DialogHeader className="shrink-0 border-b p-6 pb-4">
                <DialogTitle className="flex items-center gap-2">
                  {Icon ? (
                    <Icon className="size-5" />
                  ) : (
                    emoji && <span>{emoji}</span>
                  )}
                  {editTitle ?? `Edit ${title}`}
                </DialogTitle>
                {editDescription && (
                  <DialogDescription>{editDescription}</DialogDescription>
                )}
              </DialogHeader>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6">
                {editContent}
              </div>

              <DialogFooter className="shrink-0 border-t p-4">
                <Button variant="outline" onClick={handleCancel}>
                  {cancelLabel}
                </Button>
                <Button onClick={handleSave} disabled={!canSave}>
                  {saveLabel}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
    </>
  );
}
