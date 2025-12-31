import { useState } from 'react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { COUNTDOWN_SEGMENT_OPTIONS, COUNTDOWN_TYPES } from './constants';
import { createCountdown } from './countdown-utils';
import type { Countdown, CountdownType } from './types';

interface AddCountdownDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (countdown: Countdown) => void;
}

export function AddCountdownDialog({
  isOpen,
  onClose,
  onAdd,
}: AddCountdownDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [segments, setSegments] = useState(6);
  const [type, setType] = useState<CountdownType>('neutral');

  const resetForm = () => {
    setName('');
    setDescription('');
    setSegments(6);
    setType('neutral');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    const countdown = createCountdown(name.trim(), segments, type);
    countdown.description = description.trim() || undefined;
    onAdd(countdown);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New Countdown</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="countdown-name">Name</Label>
            <Input
              id="countdown-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Ritual Completion"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="countdown-description">
              Description (optional)
            </Label>
            <Textarea
              id="countdown-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What happens when complete?"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Segments</Label>
              <Select
                value={String(segments)}
                onValueChange={v => setSegments(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTDOWN_SEGMENT_OPTIONS.map(n => (
                    <SelectItem key={n} value={String(n)}>
                      {n} segments
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={type}
                onValueChange={v => setType(v as CountdownType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTDOWN_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      <span className={t.color}>{t.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
