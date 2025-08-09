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

export type ClassFormValues = {
  className: string;
  subclass: string;
};

export type ClassDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<ClassFormValues>;
  classItems: ComboboxItem[];
  subclassItems: ComboboxItem[];
  submit: (e?: BaseSyntheticEvent) => void | Promise<void>;
  onCancel: () => void;
};

export function ClassDrawer({
  open,
  onOpenChange,
  form,
  classItems,
  subclassItems,
  submit,
  onCancel,
}: ClassDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Class & Subclass</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-[max(8px,env(safe-area-inset-bottom))]">
          <Form {...form}>
            <form className="space-y-4" onSubmit={submit} noValidate>
              <FormField
                control={form.control as never}
                name="className"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl>
                      <Combobox
                        items={classItems}
                        value={field.value}
                        onChange={(v: string | null) =>
                          field.onChange(v ?? field.value)
                        }
                        placeholder="Search class..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as never}
                name="subclass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subclass</FormLabel>
                    <FormControl>
                      <Combobox
                        items={subclassItems}
                        value={field.value}
                        onChange={(v: string | null) =>
                          field.onChange(v ?? field.value)
                        }
                        placeholder="Select subclass..."
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
