import { PawPrint } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CompanionHopeToggleProps {
  filled: boolean;
  onToggle: () => void;
}

export function CompanionHopeToggle({
  filled,
  onToggle,
}: CompanionHopeToggleProps) {
  return (
    <div className="rounded-lg border-2 border-emerald-400/50 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PawPrint className="size-5 text-emerald-600" />
          <div>
            <Label className="font-medium text-emerald-700 dark:text-emerald-300">
              Companion Hope
            </Label>
            <p className="text-muted-foreground text-xs">
              From Light in the Dark training
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={`flex size-12 items-center justify-center rounded-xl border-2 transition-all ${
            filled
              ? 'border-emerald-500 bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg'
              : 'border-dashed border-emerald-400 bg-white hover:border-emerald-500 dark:bg-emerald-900/30'
          }`}
          aria-label={`Companion hope ${filled ? 'filled' : 'empty'}`}
        >
          <PawPrint
            className={`size-5 ${filled ? 'text-white' : 'opacity-40'}`}
          />
        </button>
      </div>
    </div>
  );
}

interface ExtraSlotsEditorProps {
  extraSlots: number;
  onDecrement: () => void;
  onIncrement: () => void;
}

export function ExtraSlotsEditor({
  extraSlots,
  onDecrement,
  onIncrement,
}: ExtraSlotsEditorProps) {
  return (
    <div>
      <Label className="mb-2 block font-medium">Extra Hope Slots</Label>
      <p className="text-muted-foreground mb-2 text-sm">
        Add additional Hope slots beyond the primary 6.
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onDecrement}
          disabled={extraSlots <= 0}
        >
          -
        </Button>
        <span className="min-w-12 text-center text-xl font-bold">
          {extraSlots}
        </span>
        <Button variant="outline" size="icon" onClick={onIncrement}>
          +
        </Button>
      </div>
    </div>
  );
}
