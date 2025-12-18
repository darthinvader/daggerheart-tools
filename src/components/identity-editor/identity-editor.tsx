import { ScrollArea } from '@/components/ui/scroll-area';
import type { IdentityFormValues } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

import { IdentityForm } from './identity-form';

interface IdentityEditorProps {
  defaultValues?: Partial<IdentityFormValues>;
  onSubmit: (values: IdentityFormValues) => void;
  onCancel?: () => void;
  className?: string;
}

export function IdentityEditor({
  defaultValues,
  onSubmit,
  onCancel,
  className,
}: IdentityEditorProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <ScrollArea className="flex-1 px-1">
        <div className="p-4">
          <IdentityForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
