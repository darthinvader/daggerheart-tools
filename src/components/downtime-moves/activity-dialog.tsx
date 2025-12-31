import { Plus } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type { DowntimeMove } from './types';

interface ActivityDialogProps {
  selectedMove: DowntimeMove | null;
  onClose: () => void;
  onConfirm: (move: DowntimeMove, notes: string, hours: number) => void;
}

export function ActivityDialog({
  selectedMove,
  onClose,
  onConfirm,
}: ActivityDialogProps) {
  const [notes, setNotes] = useState('');
  const [hours, setHours] = useState(selectedMove?.defaultHoursRequired ?? 4);

  const handleConfirm = () => {
    if (!selectedMove) return;
    onConfirm(selectedMove, notes, hours);
    setNotes('');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNotes('');
      onClose();
    }
  };

  return (
    <Dialog open={selectedMove !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start: {selectedMove?.name}</DialogTitle>
          <DialogDescription>{selectedMove?.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="activity-hours">Hours to Spend</Label>
            <Input
              id="activity-hours"
              type="number"
              min={1}
              value={hours}
              onChange={e =>
                setHours(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity-notes">Notes (optional)</Label>
            <Textarea
              id="activity-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What are you trying to accomplish?"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            <Plus className="mr-1 h-4 w-4" />
            Start Activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
