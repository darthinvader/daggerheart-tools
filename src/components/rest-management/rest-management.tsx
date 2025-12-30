import { Bed, Moon } from 'lucide-react';

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
import { Slider } from '@/components/ui/slider';

import { RestEffectsPreview } from './rest-effects-preview';
import { RestOptionCard } from './rest-option-card';
import {
  calculateLongRestEffects,
  calculateShortRestEffects,
  getTimeSinceRest,
} from './rest-utils';
import type {
  CharacterResources,
  RestEffects,
  RestState,
  RestType,
} from './types';

interface RestManagementProps {
  restState: RestState;
  resources: CharacterResources;
  onRest: (type: RestType, effects: RestEffects) => void;
}

export function RestManagement({
  restState,
  resources,
  onRest,
}: RestManagementProps) {
  const [selectedType, setSelectedType] = useState<RestType | null>(null);
  const [hopeToSpend, setHopeToSpend] = useState(0);

  const handleSelectRest = (type: RestType) => {
    setSelectedType(type);
    setHopeToSpend(0);
  };

  const handleConfirmRest = () => {
    if (!selectedType) return;

    const effects =
      selectedType === 'long'
        ? calculateLongRestEffects(resources)
        : calculateShortRestEffects(resources, hopeToSpend);

    onRest(selectedType, effects);
    setSelectedType(null);
  };

  const previewEffects =
    selectedType === 'long'
      ? calculateLongRestEffects(resources)
      : calculateShortRestEffects(resources, hopeToSpend);

  return (
    <>
      <div className="space-y-4">
        {/* Rest History */}
        <div className="text-muted-foreground flex justify-between text-sm">
          <span>
            Last short rest: {getTimeSinceRest(restState.lastShortRest)}
          </span>
          <span>
            Last long rest: {getTimeSinceRest(restState.lastLongRest)}
          </span>
        </div>

        {/* Rest Options */}
        <div className="grid gap-4 sm:grid-cols-2">
          <RestOptionCard
            type="short"
            lastRest={restState.lastShortRest}
            onSelect={() => handleSelectRest('short')}
          />
          <RestOptionCard
            type="long"
            lastRest={restState.lastLongRest}
            onSelect={() => handleSelectRest('long')}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={selectedType !== null}
        onOpenChange={() => setSelectedType(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedType === 'long' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Bed className="h-5 w-5" />
              )}
              {selectedType === 'long' ? 'Long Rest' : 'Short Rest'}
            </DialogTitle>
            <DialogDescription>
              {selectedType === 'long'
                ? 'You will fully recover all resources'
                : 'Spend Hope to recover Hit Points'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Short rest: Hope spending slider */}
            {selectedType === 'short' && resources.hope.current > 0 && (
              <div className="space-y-3">
                <Label>Hope to spend for healing ({hopeToSpend})</Label>
                <Slider
                  value={[hopeToSpend]}
                  onValueChange={(values: number[]) =>
                    setHopeToSpend(values[0])
                  }
                  min={0}
                  max={resources.hope.current}
                  step={1}
                />
                <p className="text-muted-foreground text-xs">
                  Each Hope spent recovers 1d6 HP
                </p>
              </div>
            )}

            {/* Preview */}
            <RestEffectsPreview
              effects={previewEffects}
              hopeSpent={hopeToSpend}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedType(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRest}>Confirm Rest</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
