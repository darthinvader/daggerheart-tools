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
import { cn } from '@/lib/utils';

interface EditableSectionProps {
  title: string;
  emoji?: string;
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
}

const MODAL_SIZE_CLASSES = {
  sm: 'sm:max-w-[450px]',
  md: 'sm:max-w-[600px]',
  lg: 'sm:max-w-[900px]',
  xl: 'sm:max-w-[1100px]',
  full: 'sm:max-w-[90vw] lg:max-w-[1200px]',
} as const;

export function EditableSection({
  title,
  emoji,
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
}: EditableSectionProps) {
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
            {emoji && <span className="text-xl">{emoji}</span>}
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

      <Dialog open={isEditing} onOpenChange={open => !open && handleCancel()}>
        <DialogContent
          className={cn(
            'grid max-h-[90vh] grid-rows-[auto_1fr_auto] gap-0 overflow-hidden p-0',
            MODAL_SIZE_CLASSES[modalSize]
          )}
        >
          <DialogHeader className="shrink-0 border-b p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              {emoji && <span>{emoji}</span>}
              {editTitle ?? `Edit ${title}`}
            </DialogTitle>
            {editDescription && (
              <DialogDescription>{editDescription}</DialogDescription>
            )}
          </DialogHeader>

          <div className="overflow-y-auto p-6">{editContent}</div>

          <DialogFooter className="shrink-0 border-t p-4">
            <Button variant="outline" onClick={handleCancel}>
              {cancelLabel}
            </Button>
            <Button onClick={handleSave}>{saveLabel}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
