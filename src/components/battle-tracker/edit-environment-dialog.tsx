import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type { EnvironmentTracker } from './types';

interface EditEnvironmentDialogProps {
  environment: EnvironmentTracker | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<EnvironmentTracker>) => void;
}

export function EditEnvironmentDialog({
  environment,
  isOpen,
  onOpenChange,
  onSave,
}: EditEnvironmentDialogProps) {
  const [countdown, setCountdown] = useState(() => environment?.countdown ?? 0);
  const [notes, setNotes] = useState(() => environment?.notes ?? '');
  const [features, setFeatures] = useState<EnvironmentTracker['features']>(
    () => environment?.features ?? []
  );

  /* eslint-disable react-hooks/set-state-in-effect -- Syncing local state from props when dialog opens is a valid pattern */
  useEffect(() => {
    if (environment && isOpen) {
      setCountdown(environment.countdown ?? 0);
      setNotes(environment.notes);
      setFeatures(environment.features);
    }
  }, [environment, isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSave = () => {
    onSave({ countdown, notes, features });
    onOpenChange(false);
  };

  const toggleFeature = (id: string) => {
    setFeatures(prev =>
      prev.map(feature =>
        feature.id === id ? { ...feature, active: !feature.active } : feature
      )
    );
  };

  if (!environment) return null;

  const activeCount = features.filter(feature => feature.active).length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit: {environment.source.name}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            <EnvironmentInfoSection environment={environment} />

            <Separator />

            <EnvironmentImpulseSection impulses={environment.source.impulses} />

            <Separator />

            <EnvironmentCountdownSection
              countdown={countdown}
              onCountdownChange={setCountdown}
            />

            <Separator />

            <EnvironmentFeaturesSection
              features={features}
              activeCount={activeCount}
              onToggleFeature={toggleFeature}
            />

            <Separator />

            <EnvironmentNotesSection notes={notes} onNotesChange={setNotes} />
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EnvironmentInfoSection({
  environment,
}: {
  environment: EnvironmentTracker;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary">Tier {environment.source.tier}</Badge>
        <Badge variant="outline">{environment.source.type}</Badge>
        <Badge variant="outline">
          Difficulty {environment.source.difficulty}
        </Badge>
      </div>
      <p className="text-muted-foreground text-sm">
        {environment.source.description}
      </p>
    </div>
  );
}

function EnvironmentImpulseSection({ impulses }: { impulses: string[] }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Impulses</Label>
      <div className="flex flex-wrap gap-1.5">
        {impulses.map(impulse => (
          <Badge key={impulse} variant="secondary">
            {impulse}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function EnvironmentCountdownSection({
  countdown,
  onCountdownChange,
}: {
  countdown: number;
  onCountdownChange: (value: number) => void;
}) {
  const label =
    countdown === 0
      ? 'No countdown'
      : countdown === 1
        ? '1 tick remaining'
        : `${countdown} ticks remaining`;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Countdown Timer</Label>
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="outline"
          onClick={() => onCountdownChange(Math.max(0, countdown - 1))}
        >
          <Minus className="size-4" />
        </Button>
        <Input
          type="number"
          value={countdown}
          onChange={event =>
            onCountdownChange(Math.max(0, parseInt(event.target.value) || 0))
          }
          className="w-20 text-center"
        />
        <Button
          size="icon"
          variant="outline"
          onClick={() => onCountdownChange(countdown + 1)}
        >
          <Plus className="size-4" />
        </Button>
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
    </div>
  );
}

function EnvironmentFeaturesSection({
  features,
  activeCount,
  onToggleFeature,
}: {
  features: EnvironmentTracker['features'];
  activeCount: number;
  onToggleFeature: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Features ({activeCount} / {features.length} active)
      </Label>
      <div className="space-y-2">
        {features.map(feature => (
          <label
            key={feature.id}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors',
              feature.active
                ? 'border-emerald-400 bg-emerald-500/10'
                : 'hover:bg-muted/50'
            )}
          >
            <input
              type="checkbox"
              checked={feature.active}
              onChange={() => onToggleFeature(feature.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{feature.name}</p>
              <p className="text-muted-foreground text-xs">
                {feature.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function EnvironmentNotesSection({
  notes,
  onNotesChange,
}: {
  notes: string;
  onNotesChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="env-notes">Notes</Label>
      <textarea
        id="env-notes"
        className="border-input bg-background w-full rounded-md border p-3 text-sm"
        rows={4}
        value={notes}
        onChange={event => onNotesChange(event.target.value)}
        placeholder="Add scene notes, ongoing effects, etc..."
      />
    </div>
  );
}
