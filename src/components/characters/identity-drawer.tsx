import type { UseFormReturn } from 'react-hook-form';

import type { BaseSyntheticEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Combobox, type ComboboxItem } from '@/components/ui/combobox';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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

export function IdentityDrawer({
  open,
  onOpenChange,
  form,
  ancestryItems,
  communityItems,
  submit,
  onCancel,
}: IdentityDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Identity</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-[max(8px,env(safe-area-inset-bottom))]">
          <Form {...form}>
            <form className="space-y-4" onSubmit={submit} noValidate>
              <FormField
                control={form.control as never}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        inputMode="text"
                        placeholder="Character name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as never}
                name="pronouns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pronouns</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="text"
                        placeholder="e.g., they/them"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control as never}
                  name="ancestry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ancestry</FormLabel>
                      <FormControl>
                        <Combobox
                          items={ancestryItems}
                          value={field.value}
                          onChange={(v: string | null) =>
                            field.onChange(v ?? field.value)
                          }
                          placeholder="Search ancestry..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as never}
                  name="community"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community</FormLabel>
                      <FormControl>
                        <Combobox
                          items={communityItems}
                          value={field.value}
                          onChange={(v: string | null) =>
                            field.onChange(v ?? field.value)
                          }
                          placeholder="Search community..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control as never}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="text"
                        placeholder="Appearance, demeanor, goals..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as never}
                name="calling"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calling</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="text"
                        placeholder="Archetype, vocation, destiny..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DrawerFooter>
                <div className="flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!form.formState.isValid}>
                    Save
                  </Button>
                </div>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
