import { X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  onBlur?: () => void;
  suggestions?: readonly string[];
  placeholder?: string;
}

export function TagInput({
  tags,
  onChange,
  onBlur,
  suggestions,
  placeholder,
}: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions =
    suggestions?.filter(
      s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
    ) ?? [];

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:bg-muted ml-1 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Input
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
            onBlur?.();
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim()) {
              e.preventDefault();
              addTag(input);
            }
          }}
          placeholder={placeholder ?? 'Type and press Enter to add'}
          className="h-9"
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="bg-popover absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border shadow-md">
            {filteredSuggestions.slice(0, 8).map(suggestion => (
              <button
                key={suggestion}
                type="button"
                className="hover:bg-muted w-full px-3 py-2 text-left text-sm"
                onMouseDown={() => addTag(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
