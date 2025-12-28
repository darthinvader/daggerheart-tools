import { ScrollArea } from '@/components/ui/scroll-area';
import type { IdentityFormValues } from '@/lib/schemas/character-state';
import { cn } from '@/lib/utils';

import { IdentityForm } from './identity-form';

interface IdentityEditorProps {
  defaultValues?: Partial<IdentityFormValues>;
  onSubmit: (values: IdentityFormValues) => void;
  onCancel?: () => void;
  className?: string;
  hideButtons?: boolean;
  formRef?: React.MutableRefObject<{ submit: () => void } | null>;
}

export function IdentityEditor({
  defaultValues,
  onSubmit,
  onCancel,
  className,
  hideButtons,
  formRef,
}: IdentityEditorProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <ScrollArea className="flex-1 px-1">
        <div className="p-4">
          <IdentityForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            onCancel={onCancel}
            hideButtons={hideButtons}
            formRef={formRef}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
