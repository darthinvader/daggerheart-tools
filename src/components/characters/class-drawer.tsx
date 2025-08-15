import type { UseFormReturn } from 'react-hook-form';

import * as React from 'react';
import type { BaseSyntheticEvent } from 'react';

import { CustomFeatureEditor } from '@/components/characters/class-drawer/custom-feature-editor';
import { CustomFeaturesList } from '@/components/characters/class-drawer/custom-features-list';
import { FeaturesToggleList } from '@/components/characters/class-drawer/features-toggle-list';
import { ClassSummary } from '@/components/characters/class-summary';
import { useDrawerAutosaveOnClose } from '@/components/characters/hooks/use-drawer-autosave';
import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { FormCombobox } from '@/components/forms/form-combobox';
import { Form } from '@/components/ui/form';
import {
  type FeatureView,
  deriveFeatureUnlocks,
} from '@/features/characters/logic';
import type {
  CustomFeature,
  CustomFeatures,
} from '@/features/characters/storage';

export type ClassFormValues = {
  className: string;
  subclass: string;
};

export type ClassDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<ClassFormValues>;
  classItems: { value: string; label: string }[];
  subclassItems: { value: string; label: string }[];
  submit: (e?: BaseSyntheticEvent) => void | Promise<void>;
  onCancel: () => void;
  mode?: 'create' | 'edit';
  level: number;
  selections: Record<string, string | number | boolean>;
  onSaveSelections: (next: Record<string, string | number | boolean>) => void;
  custom: CustomFeatures;
  onSaveCustom: (list: CustomFeatures) => void;
};

function ClassDrawerImpl({
  open,
  onOpenChange,
  form,
  classItems,
  subclassItems,
  submit,
  onCancel,
  mode = 'edit',
  level,
  selections,
  onSaveSelections,
  custom,
  onSaveCustom,
}: ClassDrawerProps) {
  const skipRef = React.useRef(false);
  const watchedClass = form.watch('className');
  const watchedSubclass = form.watch('subclass');
  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;
  const isDirty = form.formState.isDirty;

  const titleText =
    mode === 'create' ? 'Choose Class & Subclass' : 'Edit Class & Subclass';
  const ctaText = mode === 'create' ? 'Create' : 'Save';

  const preview: FeatureView[] = React.useMemo(() => {
    const c = watchedClass ?? '';
    const s = watchedSubclass ?? '';
    if (!c || !s) return [];
    return deriveFeatureUnlocks(c, s);
  }, [watchedClass, watchedSubclass]);

  const [localSel, setLocalSel] = React.useState(selections);
  const [localCustom, setLocalCustom] = React.useState<CustomFeatures>(custom);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const [draft, setDraft] = React.useState<CustomFeature>({
    name: '',
    description: '',
    level: 1,
    type: '',
    tags: [],
    tier: undefined,
    unlockCondition: '',
  });

  React.useEffect(() => {
    if (open) {
      setLocalSel(selections);
      setLocalCustom(custom);
      setEditIndex(null);
      setDraft({
        name: '',
        description: '',
        level: 1,
        type: '',
        tags: [],
        tier: undefined,
        unlockCondition: '',
      });
    }
  }, [open, selections, custom]);

  const merged = React.useMemo(() => {
    const all = [...preview];
    const l1 = all
      .filter(f => f.level === 1)
      .sort((a, b) => a.name.localeCompare(b.name));
    const rest = all
      .filter(f => f.level !== 1)
      .sort((a, b) =>
        a.level === b.level ? a.name.localeCompare(b.name) : a.level - b.level
      );
    return [...l1, ...rest];
  }, [preview]);

  const hasSelectionChanges = React.useMemo(() => {
    const keys = new Set<string>([
      ...Object.keys(selections),
      ...Object.keys(localSel),
    ]);
    for (const k of keys) {
      if (selections[k] !== localSel[k]) return true;
    }
    return false;
  }, [selections, localSel]);

  const hasCustomChanges = React.useMemo(() => {
    if (localCustom.length !== custom.length) return true;
    return JSON.stringify(localCustom) !== JSON.stringify(custom);
  }, [localCustom, custom]);

  const hasFeatureChanges = hasSelectionChanges || hasCustomChanges;

  const disableSubmit =
    isSubmitting ||
    !isValid ||
    (mode === 'edit' ? !isDirty && !hasFeatureChanges : false);

  // Autosave on close when form is valid and there are changes
  useDrawerAutosaveOnClose({
    open,
    trigger: () => Promise.resolve(isValid && (isDirty || hasFeatureChanges)),
    submit: () => submit(),
    skipRef,
  });

  return (
    <DrawerScaffold
      open={open}
      onOpenChange={onOpenChange}
      title={titleText}
      onCancel={() => {
        skipRef.current = true;
        onCancel();
      }}
      onSubmit={e => {
        onSaveSelections(localSel);
        onSaveCustom(localCustom);
        skipRef.current = true;
        return submit(e);
      }}
      submitLabel={ctaText}
      submitDisabled={disableSubmit}
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={submit} noValidate>
          <FormCombobox<ClassFormValues, 'className'>
            name="className"
            label="Class"
            items={classItems}
            onValueChange={(next, prev) => {
              if (prev !== next) {
                const currentSubclass = form.getValues('subclass');
                if (currentSubclass) {
                  form.setValue('subclass', '', {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }
            }}
          />
          <FormCombobox<ClassFormValues, 'subclass'>
            name="subclass"
            label="Subclass"
            items={subclassItems}
            disabled={!watchedClass}
          />
        </form>
      </Form>

      {watchedClass ? (
        <div className="mt-4 space-y-4">
          <ClassSummary
            className={watchedClass}
            subclass={watchedSubclass}
            showStats={true}
          />

          <FeaturesToggleList
            features={merged}
            selections={localSel}
            setSelections={setLocalSel}
            level={level}
          />

          <div>
            <div className="text-muted-foreground mb-2 text-xs font-medium">
              Custom features
            </div>
            <CustomFeaturesList
              list={localCustom}
              onEdit={(idx, cf) => {
                setEditIndex(idx);
                setDraft({ ...cf });
              }}
              onRemove={idx => {
                setLocalCustom(prev => prev.filter((_, i) => i !== idx));
                if (editIndex === idx) {
                  setEditIndex(null);
                  setDraft({
                    name: '',
                    description: '',
                    level: 1,
                    type: '',
                    tags: [],
                    tier: undefined,
                    unlockCondition: '',
                  });
                }
              }}
            />
            <CustomFeatureEditor
              draft={draft}
              setDraft={setDraft}
              editIndex={editIndex}
              onCommit={(next, index) => {
                if (!next.name.trim() || !next.description.trim()) return;
                if (index === null) {
                  setLocalCustom(prev => [
                    ...prev,
                    {
                      ...next,
                      type: next.type || undefined,
                      unlockCondition: next.unlockCondition || undefined,
                    },
                  ]);
                } else {
                  setLocalCustom(prev =>
                    prev.map((it, i) =>
                      i === index
                        ? {
                            ...next,
                            type: next.type || undefined,
                            unlockCondition: next.unlockCondition || undefined,
                          }
                        : it
                    )
                  );
                }
                setEditIndex(null);
                setDraft({
                  name: '',
                  description: '',
                  level: 1,
                  type: '',
                  tags: [],
                  tier: undefined,
                  unlockCondition: '',
                });
              }}
              onCancelEdit={() => {
                setEditIndex(null);
                setDraft({
                  name: '',
                  description: '',
                  level: 1,
                  type: '',
                  tags: [],
                  tier: undefined,
                  unlockCondition: '',
                });
              }}
            />
          </div>
        </div>
      ) : null}
    </DrawerScaffold>
  );
}
export const ClassDrawer = React.memo(ClassDrawerImpl);
