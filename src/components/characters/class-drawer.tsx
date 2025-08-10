import type { UseFormReturn } from 'react-hook-form';

import type { BaseSyntheticEvent } from 'react';
import * as React from 'react';

import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
// Use reusable RHF + Combobox field
import { FormCombobox } from '@/components/forms/form-combobox';
import { Form } from '@/components/ui/form';

// Using CSS dynamic viewport units (dvh) for correct keyboard interactions

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
  // When creating a new character, show create-focused copy and UX tweaks
  mode?: 'create' | 'edit';
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
}: ClassDrawerProps) {
  const watchedClass = form.watch('className');
  const isSubmitting = form.formState.isSubmitting;
  const isValid = form.formState.isValid;
  const isDirty = form.formState.isDirty;
  const disableSubmit =
    !isValid || isSubmitting || (!isDirty && mode === 'edit');

  const titleText =
    mode === 'create' ? 'Choose Class & Subclass' : 'Edit Class & Subclass';
  const ctaText = mode === 'create' ? 'Create' : 'Save';

  return (
    <DrawerScaffold
      open={open}
      onOpenChange={onOpenChange}
      title={titleText}
      onCancel={onCancel}
      onSubmit={submit}
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
    </DrawerScaffold>
  );
}
export const ClassDrawer = React.memo(ClassDrawerImpl);
