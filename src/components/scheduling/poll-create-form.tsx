// Form for creating a new scheduling poll with time slots

import { Plus, Trash2, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateId } from '@/lib/utils';

interface SlotInput {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  label: string;
}

function createEmptySlot(): SlotInput {
  return {
    id: generateId(),
    date: '',
    startTime: '',
    endTime: '',
    label: '',
  };
}

interface TimeSlotRowProps {
  slot: SlotInput;
  idx: number;
  onUpdate: (id: string, field: keyof SlotInput, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

function TimeSlotRow({
  slot,
  idx,
  onUpdate,
  onRemove,
  canRemove,
}: TimeSlotRowProps) {
  const handleFieldChange =
    (field: keyof SlotInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(slot.id, field, e.target.value);
    };

  const handleRemove = useCallback(() => {
    onRemove(slot.id);
  }, [slot.id, onRemove]);

  return (
    <div className="bg-muted/50 flex flex-wrap items-end gap-2 rounded-md border p-3">
      <div className="min-w-35 flex-1 space-y-1">
        <Label className="text-xs" htmlFor={`slot-date-${idx}`}>
          Date
        </Label>
        <Input
          id={`slot-date-${idx}`}
          type="date"
          value={slot.date}
          onChange={handleFieldChange('date')}
          required
        />
      </div>
      <div className="min-w-28 space-y-1">
        <Label className="text-xs" htmlFor={`slot-start-${idx}`}>
          Start
        </Label>
        <Input
          id={`slot-start-${idx}`}
          type="time"
          value={slot.startTime}
          onChange={handleFieldChange('startTime')}
          required
        />
      </div>
      <div className="min-w-28 space-y-1">
        <Label className="text-xs" htmlFor={`slot-end-${idx}`}>
          End
        </Label>
        <Input
          id={`slot-end-${idx}`}
          type="time"
          value={slot.endTime}
          onChange={handleFieldChange('endTime')}
          required
        />
      </div>
      <div className="min-w-30 flex-1 space-y-1">
        <Label className="text-xs" htmlFor={`slot-label-${idx}`}>
          Label
        </Label>
        <Input
          id={`slot-label-${idx}`}
          value={slot.label}
          onChange={handleFieldChange('label')}
          placeholder="optional"
        />
      </div>
      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={handleRemove}
          aria-label={`Remove slot ${idx + 1}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

interface PollCreateFormProps {
  onSubmit: (
    title: string,
    slots: Array<{ startTime: string; endTime: string; label?: string }>,
    options?: { description?: string; quorum?: number }
  ) => Promise<void>;
  onCancel: () => void;
}

export function PollCreateForm({ onSubmit, onCancel }: PollCreateFormProps) {
  const [title, setTitle] = useState('Next Session');
  const [description, setDescription] = useState('');
  const [quorum, setQuorum] = useState(1);
  const [slots, setSlots] = useState<SlotInput[]>([
    createEmptySlot(),
    createEmptySlot(),
    createEmptySlot(),
  ]);
  const [creating, setCreating] = useState(false);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value),
    []
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setDescription(e.target.value),
    []
  );

  const handleQuorumChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setQuorum(Number(e.target.value)),
    []
  );

  const addSlot = useCallback(() => {
    setSlots(prev => [...prev, createEmptySlot()]);
  }, []);

  const removeSlot = useCallback((id: string) => {
    setSlots(prev => prev.filter(s => s.id !== id));
  }, []);

  const updateSlot = useCallback(
    (id: string, field: keyof SlotInput, value: string) => {
      setSlots(prev =>
        prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
      );
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate
      const validSlots = slots.filter(s => s.date && s.startTime && s.endTime);
      if (!title.trim() || validSlots.length === 0) return;

      setCreating(true);
      try {
        const mapped = validSlots.map(s => ({
          startTime: new Date(`${s.date}T${s.startTime}`).toISOString(),
          endTime: new Date(`${s.date}T${s.endTime}`).toISOString(),
          label: s.label || undefined,
        }));
        await onSubmit(title.trim(), mapped, {
          description: description.trim() || undefined,
          quorum: quorum > 0 ? quorum : 1,
        });
      } finally {
        setCreating(false);
      }
    },
    [title, description, quorum, slots, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="poll-title">Poll Title</Label>
        <Input
          id="poll-title"
          value={title}
          onChange={handleTitleChange}
          placeholder="e.g. Next Session"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="poll-description">Description (optional)</Label>
        <Textarea
          id="poll-description"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Any notes about timing preferences..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="poll-quorum">Minimum "available" votes needed</Label>
        <Input
          id="poll-quorum"
          type="number"
          min={1}
          max={20}
          value={quorum}
          onChange={handleQuorumChange}
          className="w-20"
        />
      </div>

      <div className="space-y-2">
        <Label>Time Slots</Label>
        <div className="space-y-3">
          {slots.map((slot, idx) => (
            <TimeSlotRow
              key={slot.id}
              slot={slot}
              idx={idx}
              onUpdate={updateSlot}
              onRemove={removeSlot}
              canRemove={slots.length > 1}
            />
          ))}
        </div>
        {slots.length < 50 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSlot}
            className="mt-2 gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Slot
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={creating}>
          {creating ? 'Creating...' : 'Create Poll'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="gap-1"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </Button>
      </div>
    </form>
  );
}
