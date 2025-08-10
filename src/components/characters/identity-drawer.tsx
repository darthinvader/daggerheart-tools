import type { UseFormReturn } from 'react-hook-form';

import type { BaseSyntheticEvent } from 'react';
import * as React from 'react';

import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { FormInput } from '@/components/forms/form-input';
import { FormSelect } from '@/components/forms/form-select';
import type { ComboboxItem } from '@/components/ui/combobox';
import { Form } from '@/components/ui/form';

// Using CSS dynamic viewport units (dvh) for correct keyboard interactions

export type IdentityFormValues = {
  name: string;
  pronouns: string;
  ancestry: string;
  community: string;
  description: string;
  calling: string;
};

export type IdentityDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<IdentityFormValues>;
  ancestryItems: ComboboxItem[];
  communityItems: ComboboxItem[];
  submit: (e?: BaseSyntheticEvent) => void | Promise<void>;
  onCancel: () => void;
};

function IdentityDrawerImpl({
  open,
  onOpenChange,
  form,
  ancestryItems,
  communityItems,
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
          />
          <FormInput<IdentityFormValues, 'pronouns'>
            name="pronouns"
            label="Pronouns"
            placeholder="e.g., they/them"
            inputMode="text"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormSelect<IdentityFormValues, 'ancestry'>
              name="ancestry"
              label="Ancestry"
              placeholder="Select ancestry..."
              items={ancestryItems}
            />
            <FormSelect<IdentityFormValues, 'community'>
              name="community"
              label="Community"
              placeholder="Select community..."
              items={communityItems}
            />
          </div>
          <FormInput<IdentityFormValues, 'description'>
            name="description"
            label="Description"
            placeholder="Appearance, demeanor, goals..."
            inputMode="text"
          />
          <FormInput<IdentityFormValues, 'calling'>
            name="calling"
            label="Calling"
            placeholder="Archetype, vocation, destiny..."
            inputMode="text"
          />
        </form>
      </Form>
    </DrawerScaffold>
  );
}
export const IdentityDrawer = React.memo(IdentityDrawerImpl);
