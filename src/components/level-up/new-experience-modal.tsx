import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (experienceName: string) => void;
}

export function NewExperienceModal({
  isOpen,
  onClose,
  onConfirm,
}: NewExperienceModalProps) {
  const [name, setName] = useState('');

  const handleConfirm = useCallback(() => {
    if (name.trim()) {
      onConfirm(name.trim());
      setName('');
    }
  }, [name, onConfirm]);

  const handleClose = useCallback(() => {
    setName('');
    onClose();
  }, [onClose]);

  const canConfirm = name.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>New Experience</DialogTitle>
          <DialogDescription>
            Name your new experience. It will start at +2.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Label htmlFor="experience-name">Experience Name</Label>
          <Input
            id="experience-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Arcane Lore, Survival, Persuasion..."
            className="mt-2"
            autoFocus
            onKeyDown={e => {
              if (e.key === 'Enter' && canConfirm) {
                handleConfirm();
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!canConfirm}>
            Add Experience
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
