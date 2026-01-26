import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { DEFAULT_CHARACTER_DRAFT } from './utils';

type AddCharacterDialogProps = {
  isOpen: boolean;
  characterDraft: typeof DEFAULT_CHARACTER_DRAFT;
  onOpenChange: (open: boolean) => void;
  onDraftChange: (draft: typeof DEFAULT_CHARACTER_DRAFT) => void;
  onAdd: () => void;
  onCancel: () => void;
};

export function AddCharacterDialog({
  isOpen,
  characterDraft,
  onOpenChange,
  onDraftChange,
  onAdd,
  onCancel,
}: AddCharacterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Character</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Name</Label>
            <Input
              value={characterDraft.name}
              onChange={event =>
                onDraftChange({
                  ...characterDraft,
                  name: event.target.value,
                })
              }
              placeholder="Character name"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Evasion</Label>
              <Input
                type="number"
                value={characterDraft.evasion}
                onChange={event =>
                  onDraftChange({
                    ...characterDraft,
                    evasion: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">HP Max</Label>
              <Input
                type="number"
                value={characterDraft.hpMax}
                onChange={event =>
                  onDraftChange({
                    ...characterDraft,
                    hpMax: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Stress Max</Label>
              <Input
                type="number"
                value={characterDraft.stressMax}
                onChange={event =>
                  onDraftChange({
                    ...characterDraft,
                    stressMax: event.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onAdd}>Add Character</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
