/**
 * Homebrew Collection Dialog
 *
 * Allows adding a homebrew item to an existing or new collection.
 */
import { FolderPlus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { HomebrewCollection } from '@/lib/schemas/homebrew';

interface HomebrewCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homebrewName: string;
  collections: HomebrewCollection[];
  onCreateCollection: (
    name: string,
    description?: string
  ) => Promise<HomebrewCollection>;
  onAddToCollection: (collectionId: string) => Promise<unknown>;
  isSubmitting?: boolean;
}

const NEW_COLLECTION_VALUE = '__new__';

export function HomebrewCollectionDialog({
  open,
  onOpenChange,
  homebrewName,
  collections,
  onCreateCollection,
  onAddToCollection,
  isSubmitting = false,
}: HomebrewCollectionDialogProps) {
  const [selection, setSelection] = useState<string>(NEW_COLLECTION_VALUE);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const canSubmit = useMemo(() => {
    if (selection === NEW_COLLECTION_VALUE) return name.trim().length > 0;
    return selection.length > 0;
  }, [name, selection]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    if (selection === NEW_COLLECTION_VALUE) {
      const created = await onCreateCollection(name.trim(), description.trim());
      await onAddToCollection(created.id);
    } else {
      await onAddToCollection(selection);
    }

    setName('');
    setDescription('');
    setSelection(NEW_COLLECTION_VALUE);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="size-4" /> Add to Collection
          </DialogTitle>
          <DialogDescription>
            Save "{homebrewName}" to a collection for quick access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="collection-select">Choose a collection</Label>
            <Select value={selection} onValueChange={setSelection}>
              <SelectTrigger id="collection-select">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NEW_COLLECTION_VALUE}>
                  Create new collection
                </SelectItem>
                {collections.map(collection => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selection === NEW_COLLECTION_VALUE && (
            <div className="space-y-2 rounded-md border border-dashed p-3">
              <div className="space-y-2">
                <Label htmlFor="collection-name">Collection Name</Label>
                <Input
                  id="collection-name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., GM Favorites"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collection-description">
                  Description (optional)
                </Label>
                <Textarea
                  id="collection-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Short note about this collection"
                  rows={2}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Add'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
