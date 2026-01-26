import { Crosshair, Minus, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AdversaryTracker } from './types';

export function AdversaryInfoSection({
  adversary,
}: {
  adversary: AdversaryTracker;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary">Tier {adversary.source.tier}</Badge>
        <Badge variant="outline">{adversary.source.role}</Badge>
      </div>
      <p className="text-muted-foreground text-sm">
        {adversary.source.description}
      </p>
    </div>
  );
}

export function AdversaryStatsSection({
  hp,
  hpMax,
  stress,
  stressMax,
  onHpChange,
  onHpMaxChange,
  onStressChange,
  onStressMaxChange,
}: {
  hp: number;
  hpMax: number;
  stress: number;
  stressMax: number;
  onHpChange: (value: number) => void;
  onHpMaxChange: (value: number) => void;
  onStressChange: (value: number) => void;
  onStressMaxChange: (value: number) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatEditor
        label="HP"
        current={hp}
        max={hpMax}
        onCurrentChange={onHpChange}
        onMaxChange={onHpMaxChange}
      />
      <StatEditor
        label="Stress"
        current={stress}
        max={stressMax}
        onCurrentChange={onStressChange}
        onMaxChange={onStressMaxChange}
      />
    </div>
  );
}

export function AdversaryDifficultyEditor({
  difficulty,
  baseDifficulty,
  onDifficultyChange,
}: {
  difficulty: number;
  baseDifficulty: number;
  onDifficultyChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Crosshair className="size-4 text-blue-500" />
        Difficulty (to hit)
      </Label>
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="outline"
          className="size-8"
          onClick={() => onDifficultyChange(Math.max(1, difficulty - 1))}
        >
          <Minus className="size-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={difficulty}
            onChange={event =>
              onDifficultyChange(Math.max(1, parseInt(event.target.value) || 1))
            }
            className="w-16 text-center text-lg font-bold"
          />
          {difficulty !== baseDifficulty && (
            <Badge variant="secondary" className="text-xs">
              Base: {baseDifficulty}
            </Badge>
          )}
        </div>
        <Button
          size="icon"
          variant="outline"
          className="size-8"
          onClick={() => onDifficultyChange(difficulty + 1)}
        >
          <Plus className="size-4" />
        </Button>
        {difficulty !== baseDifficulty && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDifficultyChange(baseDifficulty)}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}

export { AdversaryAttackEditor } from './edit-adversary-dialog-attack';
export { AdversaryThresholdsEditor } from './edit-adversary-dialog-thresholds';

export function AdversaryNotesEditor({
  notes,
  onNotesChange,
}: {
  notes: string;
  onNotesChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <textarea
        id="notes"
        className="border-input bg-background w-full rounded-md border p-3 text-sm"
        rows={4}
        value={notes}
        onChange={event => onNotesChange(event.target.value)}
        placeholder="Add combat notes, status effects, etc..."
      />
    </div>
  );
}

function StatEditor({
  label,
  current,
  max,
  onCurrentChange,
  onMaxChange,
}: {
  label: string;
  current: number;
  max: number;
  onCurrentChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            onClick={() => onCurrentChange(Math.max(0, current - 1))}
          >
            <Minus className="size-3" />
          </Button>
          <Input
            type="number"
            value={current}
            onChange={event =>
              onCurrentChange(Math.max(0, parseInt(event.target.value) || 0))
            }
            className="h-8 w-16 text-center"
          />
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            onClick={() => onCurrentChange(Math.min(max, current + 1))}
          >
            <Plus className="size-3" />
          </Button>
        </div>
        <span className="text-muted-foreground">/</span>
        <Input
          type="number"
          value={max}
          onChange={event =>
            onMaxChange(Math.max(1, parseInt(event.target.value) || 1))
          }
          className="h-8 w-16 text-center"
          title="Max value"
        />
      </div>
    </div>
  );
}
