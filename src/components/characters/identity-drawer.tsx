import type { UseFormReturn } from 'react-hook-form';

import type { BaseSyntheticEvent } from 'react';
import * as React from 'react';

import { DrawerScaffold } from '@/components/drawers/drawer-scaffold';
import { FormInput } from '@/components/forms/form-input';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Keep identity minimal: only Name and Pronouns live here now.
export type IdentityFormValues = {
  name: string;
  pronouns: string;
  description?: string;
  calling?: string;
  background?: string | { question: string; answer: string }[];
  descriptionDetails?: {
    eyes?: string;
    hair?: string;
    skin?: string;
    body?: string;
    clothing?: string;
    mannerisms?: string;
    other?: string;
  };
  connections?: {
    prompt: string;
    answer: string;
    withPlayer?: { id?: string; name?: string };
  }[];
};

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
          {/* Optional basic description and calling (already in schema) */}
          <FormInput<IdentityFormValues, 'calling'>
            name="calling"
            label="Calling"
            placeholder="e.g., Explorer"
            inputMode="text"
            enterKeyHint="next"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              data-field="description"
              placeholder="Short character description"
              value={(form.getValues() as IdentityFormValues).description ?? ''}
              onChange={e => form.setValue('description', e.target.value)}
            />
          </div>
          {/* Description details */}
          <div className="grid grid-cols-2 gap-2">
            <FormInput<IdentityFormValues, 'descriptionDetails.eyes'>
              name={'descriptionDetails.eyes' as never}
              label="Eyes"
              placeholder="e.g., green"
              inputMode="text"
            />
            <FormInput<IdentityFormValues, 'descriptionDetails.hair'>
              name={'descriptionDetails.hair' as never}
              label="Hair"
              placeholder="e.g., black"
              inputMode="text"
            />
            <FormInput<IdentityFormValues, 'descriptionDetails.skin'>
              name={'descriptionDetails.skin' as never}
              label="Skin"
              placeholder="e.g., tan"
              inputMode="text"
            />
            <FormInput<IdentityFormValues, 'descriptionDetails.body'>
              name={'descriptionDetails.body' as never}
              label="Body"
              placeholder="e.g., athletic"
              inputMode="text"
            />
            <FormInput<IdentityFormValues, 'descriptionDetails.clothing'>
              name={'descriptionDetails.clothing' as never}
              label="Clothing"
              placeholder="e.g., travel leathers"
              inputMode="text"
            />
            <FormInput<IdentityFormValues, 'descriptionDetails.mannerisms'>
              name={'descriptionDetails.mannerisms' as never}
              label="Mannerisms"
              placeholder="e.g., fidgets with ring"
              inputMode="text"
            />
          </div>
          <FormInput<IdentityFormValues, 'descriptionDetails.other'>
            name={'descriptionDetails.other' as never}
            label="Other"
            placeholder="Anything notable"
            inputMode="text"
          />
          {/* Background (simple freeform for now) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Background</label>
            <Textarea
              data-field="background"
              placeholder="Background story or bullet Q&A"
              value={
                typeof (form.getValues() as IdentityFormValues).background ===
                'string'
                  ? ((form.getValues() as IdentityFormValues)
                      .background as string)
                  : ''
              }
              onChange={e => form.setValue('background', e.target.value)}
            />
          </div>
          {/* Connections: prompt/answer pairs with add/remove */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Connections</label>
            <div className="grid grid-cols-1 gap-2">
              {(form.watch('connections') ?? [{ prompt: '', answer: '' }]).map(
                (c, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1fr_1fr_auto] items-center gap-2"
                  >
                    <Input
                      placeholder="Prompt"
                      value={c.prompt}
                      onChange={e => {
                        const list = [...(form.watch('connections') ?? [])];
                        list[idx] = { ...c, prompt: e.target.value };
                        form.setValue('connections', list);
                      }}
                    />
                    <Input
                      placeholder="Answer"
                      value={c.answer}
                      onChange={e => {
                        const list = [...(form.watch('connections') ?? [])];
                        list[idx] = { ...c, answer: e.target.value };
                        form.setValue('connections', list);
                      }}
                    />
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground h-8 rounded px-2 text-sm"
                      aria-label="Remove connection"
                      onClick={() => {
                        const list = [...(form.watch('connections') ?? [])];
                        list.splice(idx, 1);
                        form.setValue('connections', list);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )
              )}
            </div>
            <div>
              <button
                type="button"
                className="text-primary text-sm hover:underline"
                onClick={() => {
                  const list = [...(form.watch('connections') ?? [])];
                  list.push({ prompt: '', answer: '' });
                  form.setValue('connections', list);
                }}
              >
                + Add connection
              </button>
            </div>
          </div>
        </form>
      </Form>
    </DrawerScaffold>
  );
}

export const IdentityDrawer = React.memo(IdentityDrawerImpl);
