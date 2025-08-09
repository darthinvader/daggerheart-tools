import { Check, ChevronsUpDown } from 'lucide-react';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type ComboboxItem = {
  value: string;
  label: string;
  // Optional metadata for consumers
  meta?: Record<string, unknown>;
};

type BaseProps = {
  items: ComboboxItem[];
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
};

export type ComboboxProps = BaseProps & {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
};

export function Combobox({
  items,
  value,
  onChange,
  placeholder = 'Search...',
  emptyMessage = 'No results found.',
  className,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selected = items.find(i => i.value === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          {selected ? selected.label : 'Select...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command
          filter={(value, search, keywords) => {
            const haystack = [value, ...(keywords ?? [])]
              .join(' ')
              .toLowerCase();
            const score = haystack.includes(search.toLowerCase()) ? 1 : 0;
            return score as 0 | 1;
          }}
        >
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map(item => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  keywords={[item.label]}
                  onSelect={v => {
                    const next = v === value ? null : v;
                    onChange(next);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export type MultiComboboxProps = BaseProps & {
  values: string[];
  onChange: (values: string[]) => void;
};

export function MultiCombobox({
  items,
  values,
  onChange,
  placeholder = 'Search...',
  emptyMessage = 'No results found.',
  className,
  disabled,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabels = items
    .filter(i => values.includes(i.value))
    .map(i => i.label)
    .join(', ');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          {selectedLabels || 'Select...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map(item => {
                const checked = values.includes(item.value);
                return (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    keywords={[item.label]}
                    onSelect={v => {
                      const exists = values.includes(v);
                      const next = exists
                        ? values.filter(x => x !== v)
                        : [...values, v];
                      onChange(next);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        checked ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
