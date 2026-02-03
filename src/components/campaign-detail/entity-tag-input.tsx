// Shared tag input component for entity cards
// Used by NPC, Location, Organization, Quest cards

import { Plus, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// =====================================================================================
// TagInputSection Component
// =====================================================================================

interface TagInputSectionProps {
  /** Current tags to display */
  tags: string[];
  /** Current input value */
  tagInput: string;
  /** Handler for input change */
  onInputChange: (value: string) => void;
  /** Handler for adding a tag */
  onAdd: () => void;
  /** Handler for removing a tag */
  onRemove: (tag: string) => void;
  /** Optional label text */
  label?: string;
  /** Optional placeholder text */
  placeholder?: string;
}

/**
 * Reusable tag input section with badge display and add functionality.
 * Handles Enter key submission and displays existing tags as removable badges.
 */
export function TagInputSection({
  tags,
  tagInput,
  onInputChange,
  onAdd,
  onRemove,
  label = 'Tags',
  placeholder = 'Add tag...',
}: TagInputSectionProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className="hover:bg-muted ml-1 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={tagInput}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button variant="outline" size="icon" onClick={onAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
