import { RotateCcw, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { AdversaryTracker } from './types';

export function AdversaryThresholdsEditor({
  description,
  isEditable,
  isModified,
  thresholdMajor,
  thresholdSevere,
  thresholdMassive,
  onMajorChange,
  onSevereChange,
  onMassiveChange,
  onReset,
}: {
  description: AdversaryTracker['source']['thresholds'];
  isEditable: boolean;
  isModified: boolean;
  thresholdMajor: number;
  thresholdSevere: number;
  thresholdMassive: number | null;
  onMajorChange: (value: number) => void;
  onSevereChange: (value: number) => void;
  onMassiveChange: (value: number | null) => void;
  onReset: () => void;
}) {
  const isDescription = typeof description === 'string';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Shield className="size-4 text-amber-500" />
          Damage Thresholds
        </Label>
        {isEditable && isModified && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 text-xs"
            onClick={onReset}
          >
            <RotateCcw className="mr-1 size-3" />
            Reset
          </Button>
        )}
      </div>
      {isDescription ? (
        <p className="text-muted-foreground bg-muted/50 rounded-md p-3 text-sm">
          {description}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Major</Label>
            <Input
              type="number"
              value={thresholdMajor}
              onChange={event =>
                onMajorChange(parseInt(event.target.value) || 0)
              }
              placeholder="5"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Severe</Label>
            <Input
              type="number"
              value={thresholdSevere}
              onChange={event =>
                onSevereChange(parseInt(event.target.value) || 0)
              }
              placeholder="12"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">
              Massive (optional)
            </Label>
            <Input
              type="number"
              value={thresholdMassive ?? ''}
              onChange={event =>
                onMassiveChange(
                  event.target.value ? parseInt(event.target.value) : null
                )
              }
              placeholder="20"
            />
          </div>
        </div>
      )}
    </div>
  );
}
