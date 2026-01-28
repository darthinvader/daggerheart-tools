/**
 * Homebrew Character Dialog
 *
 * Allows linking a homebrew item to one of the user's characters.
 */
import { Link2, User } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CharacterSummary } from '@/lib/api/characters';

interface HomebrewCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homebrewName: string;
  characters: CharacterSummary[];
  onLink: (characterId: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function HomebrewCharacterDialog({
  open,
  onOpenChange,
  homebrewName,
  characters,
  onLink,
  isSubmitting = false,
}: HomebrewCharacterDialogProps) {
  const [selection, setSelection] = useState<string>('');
  const canSubmit = useMemo(() => selection.length > 0, [selection]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await onLink(selection);
    setSelection('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="size-4" /> Add to Character
          </DialogTitle>
          <DialogDescription>
            Add "{homebrewName}" to a character you own.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Select value={selection} onValueChange={setSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Select character" />
              </SelectTrigger>
              <SelectContent>
                {characters.map(character => (
                  <SelectItem key={character.id} value={character.id}>
                    <span className="flex items-center gap-2">
                      <User className="size-4 text-indigo-500" />
                      {character.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? 'Linking...' : 'Add'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
