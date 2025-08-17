import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';

import { ClassSection } from '@/components/characters/character-page/class-section';
import { ClassDrawerLazy } from '@/components/characters/drawers-lazy';
import type { ComboboxItem } from '@/components/ui/combobox';
import type { ClassDraft } from '@/features/characters/storage';

export function ClassBlock({
  classDraft,
  open,
  onOpenChange,
  form,
  submit,
  classItems,
  subclassItems,
  level,
  selections,
  onSaveSelections,
  custom,
  onSaveCustom,
}: {
  classDraft: ClassDraft;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  form: UseFormReturn<ClassDraft>;
  submit: () => void;
  classItems: ComboboxItem[];
  subclassItems: ComboboxItem[];
  level: number;
  selections: Record<string, string | number | boolean>;
  onSaveSelections: (v: Record<string, string | number | boolean>) => void;
  custom: ReturnType<
    typeof import('@/features/characters/storage').readCustomFeaturesFromStorage
  >;
  onSaveCustom: (
    list: ReturnType<
      typeof import('@/features/characters/storage').readCustomFeaturesFromStorage
    >
  ) => void;
}) {
  React.useEffect(() => {
    if (open) form.reset(classDraft);
  }, [open, classDraft, form]);

  return (
    <>
      <ClassSection
        classDraft={{
          className: classDraft.className,
          subclass: classDraft.subclass,
        }}
        level={level}
        featureSelections={selections}
        customFeatures={custom}
        onEdit={() => onOpenChange(true)}
      />
      <React.Suspense fallback={null}>
        <ClassDrawerLazy
          open={open}
          onOpenChange={onOpenChange}
          form={form as never}
          classItems={classItems}
          subclassItems={subclassItems}
          submit={() => {
            submit();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
          level={level}
          selections={selections}
          onSaveSelections={onSaveSelections}
          custom={custom}
          onSaveCustom={onSaveCustom}
        />
      </React.Suspense>
    </>
  );
}
