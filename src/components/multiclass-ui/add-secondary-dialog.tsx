import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { AVAILABLE_CLASSES } from './constants';

interface AddSecondaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (className: string) => void;
  primaryClass: string;
}

export function AddSecondaryDialog({
  isOpen,
  onClose,
  onConfirm,
  primaryClass,
}: AddSecondaryDialogProps) {
  const [selectedClass, setSelectedClass] = useState('');

  const availableClasses = AVAILABLE_CLASSES.filter(c => c !== primaryClass);

  const handleConfirm = () => {
    if (!selectedClass) return;
    onConfirm(selectedClass);
    setSelectedClass('');
  };

  const handleClose = () => {
    setSelectedClass('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Secondary Class</DialogTitle>
          <DialogDescription>
            Choose a secondary class to multiclass into. You'll gain its
            Foundation feature.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Secondary Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a class..." />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map(cls => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedClass}>
            Add Class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
