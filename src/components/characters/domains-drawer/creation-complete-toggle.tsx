import type { UseFormReturn } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

export function CreationCompleteToggle({
  form,
}: {
  form: UseFormReturn<{ creationComplete?: boolean }>;
}) {
  return (
    <FormField
      control={form.control as never}
      name="creationComplete"
      render={({ field }) => (
        <FormItem className="flex items-center gap-2 pt-1">
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={v => field.onChange(!!v)}
            />
          </FormControl>
          <FormLabel className="!mt-0">Creation complete</FormLabel>
        </FormItem>
      )}
    />
  );
}
