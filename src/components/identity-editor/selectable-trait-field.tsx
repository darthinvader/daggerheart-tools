import type { AnyFieldApi } from '@tanstack/react-form';
import { useState } from 'react';

import { FormField } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormProps {
  Field: React.ComponentType<{
    name: string;
    children: (field: AnyFieldApi) => React.ReactNode;
  }>;
}

interface SelectableTraitFieldProps {
  name: string;
  label: string;
  htmlFor: string;
  placeholder: string;
  suggestions: readonly string[];
  form: FormProps;
}

export function SelectableTraitField({
  name,
  label,
  htmlFor,
  placeholder,
  suggestions,
  form,
}: SelectableTraitFieldProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <form.Field name={name}>
      {(field: AnyFieldApi) => {
        const currentValue = (field.state.value as string) ?? '';
        const displayValue = inputValue || currentValue;

        const filteredSuggestions = suggestions.filter(s =>
          s.toLowerCase().includes(displayValue.toLowerCase())
        );

        const handleSelect = (suggestion: string) => {
          field.handleChange(suggestion);
          setInputValue('');
          setShowSuggestions(false);
        };

        const handleInputChange = (value: string) => {
          setInputValue(value);
          field.handleChange(value);
          setShowSuggestions(true);
        };

        return (
          <FormField
            label={label}
            htmlFor={htmlFor}
            error={field.state.meta.errors.join(', ')}
          >
            <div className="relative">
              <Input
                id={htmlFor}
                placeholder={placeholder}
                value={displayValue}
                onChange={e => handleInputChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  field.handleBlur();
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div
                  className={cn(
                    'bg-popover absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border shadow-md'
                  )}
                >
                  {filteredSuggestions.slice(0, 8).map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      className={cn(
                        'hover:bg-muted w-full px-3 py-2 text-left text-sm',
                        suggestion === currentValue && 'bg-muted/50 font-medium'
                      )}
                      onMouseDown={() => handleSelect(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FormField>
        );
      }}
    </form.Field>
  );
}
