import type { UseFormReturn } from 'react-hook-form';

import type { BaseSyntheticEvent } from 'react';
import * as React from 'react';

import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { FormInput } from '@/components/forms/form-input';
import { Form } from '@/components/ui/form';

// Keep identity minimal: only Name and Pronouns live here now.
export type IdentityFormValues = { name: string; pronouns: string };

export type IdentityDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<IdentityFormValues>;
  submit: (e?: BaseSyntheticEvent) => void | Promise<void>;
  onCancel: () => void;
};

function IdentityDrawerImpl({
  open,
  onOpenChange,
  form,
  submit,
  onCancel,
}: IdentityDrawerProps) {
  return (
    <DrawerScaffold
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Identity"
      onCancel={onCancel}
      onSubmit={submit}
      submitDisabled={!form.formState.isValid}
    >
      <Form {...form}>
        <form className="space-y-4" onSubmit={submit} noValidate>
          <FormInput<IdentityFormValues, 'name'>
            name="name"
            label="Name"
            placeholder="Character name"
            inputMode="text"
            enterKeyHint="next"
          />
          <FormInput<IdentityFormValues, 'pronouns'>
            name="pronouns"
            label="Pronouns"
            placeholder="e.g., they/them"
            inputMode="text"
            enterKeyHint="done"
          />
        </form>
      </Form>
    </DrawerScaffold>
  );
}

export const IdentityDrawer = React.memo(IdentityDrawerImpl);
