import { X } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Scar } from '@/lib/schemas/session-state';

import type { HopeWithScarsState } from './hope-with-scars-display';

interface HopeEditorProps {
  state: HopeWithScarsState;
  onChange: (state: HopeWithScarsState) => void;
  /** Extra Hope slots from companion's Light in the Dark training */
  bonusHopeSlots?: number;
}

interface ScarItemProps {
  scar: Scar;
  onRemove: () => void;
}

function ScarItem({ scar, onRemove }: ScarItemProps) {
  return (
    <div className="bg-destructive/10 flex items-start justify-between rounded-lg border p-3">
      <div className="space-y-1">
        <div className="font-medium">{scar.description}</div>
        {scar.narrativeImpact && (
          <div className="text-muted-foreground text-sm">
            {scar.narrativeImpact}
          </div>
        )}
        <div className="text-muted-foreground text-xs">
          Hope Slot #{scar.hopeSlotIndex + 1} permanently crossed out
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="shrink-0"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

interface HopeCounterProps {
  current: number;
  max: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

function HopeCounter({
  current,
  max,
  onDecrement,
  onIncrement,
}: HopeCounterProps) {
  return (
    <div>
      <Label className="mb-2 block font-medium">Current Hope</Label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onDecrement}
          disabled={current <= 0}
        >
          -
        </Button>
        <span className="min-w-12 text-center text-xl font-bold">
          {current} / {max}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onIncrement}
          disabled={current >= max}
        >
          +
        </Button>
      </div>
    </div>
  );
}

interface AddScarFormProps {
  targetSlot: number;
  onAdd: (description: string, narrative: string) => void;
}

function AddScarForm({ targetSlot, onAdd }: AddScarFormProps) {
  const [description, setDescription] = useState('');
  const [narrative, setNarrative] = useState('');

  const handleAdd = () => {
    onAdd(description, narrative);
    setDescription('');
    setNarrative('');
  };

  return (
    <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
      <Label className="font-medium">Add New Scar</Label>
      <p className="text-muted-foreground text-sm">
        When you avoid death and roll equal to or under your level on your Hope
        Die, you gain a scar. This permanently crosses out a Hope slot.
      </p>
      <div className="space-y-2">
        <Input
          placeholder="Scar description (e.g., 'Jagged wound across my chest')"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <Textarea
          placeholder="Narrative impact (optional)"
          value={narrative}
          onChange={e => setNarrative(e.target.value)}
          rows={2}
        />
        <Button onClick={handleAdd} variant="destructive" size="sm">
          Add Scar (Cross Out Hope Slot #{targetSlot + 1})
        </Button>
      </div>
    </div>
  );
}

export function HopeEditor({
  state,
  onChange,
  bonusHopeSlots = 0,
}: HopeEditorProps) {
  const totalSlots = 6 + bonusHopeSlots;
  const effectiveMax = state.max + bonusHopeSlots;
  const availableSlots = Array.from({ length: totalSlots }, (_, i) => i).filter(
    idx => !state.scars.some(s => s.hopeSlotIndex === idx)
  );

  const handleAddScar = (description: string, narrative: string) => {
    if (availableSlots.length === 0) return;

    const newScar: Scar = {
      id: crypto.randomUUID(),
      description: description || 'Unmarked Scar',
      hopeSlotIndex: availableSlots[availableSlots.length - 1],
      narrativeImpact: narrative || undefined,
    };

    const newMax = Math.max(0, state.max - 1);
    const newCurrent = Math.min(state.current, newMax + bonusHopeSlots);

    onChange({
      ...state,
      current: newCurrent,
      max: newMax,
      scars: [...state.scars, newScar],
    });
  };

  const handleRemoveScar = (scarId: string) => {
    const updatedScars = state.scars.filter(s => s.id !== scarId);
    onChange({
      ...state,
      max: Math.min(6, state.max + 1),
      scars: updatedScars,
    });
  };

  return (
    <div className="space-y-6">
      <HopeCounter
        current={state.current}
        max={effectiveMax}
        onDecrement={() =>
          onChange({ ...state, current: Math.max(0, state.current - 1) })
        }
        onIncrement={() =>
          onChange({
            ...state,
            current: Math.min(effectiveMax, state.current + 1),
          })
        }
      />

      <div className="space-y-3">
        <Label className="font-medium">Scars ({state.scars.length})</Label>
        {state.scars.length > 0 ? (
          <div className="space-y-2">
            {state.scars.map(scar => (
              <ScarItem
                key={scar.id}
                scar={scar}
                onRemove={() => handleRemoveScar(scar.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No scars yet. Scars are gained when avoiding death.
          </p>
        )}
      </div>

      {availableSlots.length > 0 && (
        <AddScarForm
          targetSlot={availableSlots[availableSlots.length - 1]}
          onAdd={handleAddScar}
        />
      )}
    </div>
  );
}
