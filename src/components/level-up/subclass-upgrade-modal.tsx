import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClassIcons, Scroll } from '@/lib/icons';
import {
  CLASS_COLORS,
  type ClassSubclassPair,
} from '@/lib/schemas/class-selection';

import type { SubclassUpgradeSelection } from './types';
import { type UpgradeOption, UpgradeOptionCard } from './upgrade-option-card';
import { getAvailableUpgrades, groupUpgradesByClass } from './upgrade-utils';

export type SubclassUpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (upgrade: SubclassUpgradeSelection) => void;
  classes: ClassSubclassPair[];
  unlockedFeatures: Record<string, string[]>;
  targetTier: string;
};

export function SubclassUpgradeModal({
  isOpen,
  onClose,
  onConfirm,
  classes,
  unlockedFeatures,
  targetTier,
}: SubclassUpgradeModalProps) {
  const [selectedOption, setSelectedOption] = useState<UpgradeOption | null>(
    null
  );

  const availableUpgrades = useMemo(
    () => getAvailableUpgrades(classes, unlockedFeatures, targetTier),
    [classes, unlockedFeatures, targetTier]
  );

  const groupedByClass = useMemo(
    () => groupUpgradesByClass(availableUpgrades),
    [availableUpgrades]
  );

  const handleConfirm = () => {
    if (selectedOption) {
      onConfirm({
        className: selectedOption.className,
        subclassName: selectedOption.subclassName,
        featureName: selectedOption.feature.name,
        featureType: selectedOption.upgradeType,
      });
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setSelectedOption(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && resetAndClose()}>
      <DialogContent className="flex max-h-[90vh] w-[98vw] max-w-4xl flex-col overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upgrade Subclass</DialogTitle>
          <DialogDescription>
            Choose a specialization or mastery feature to unlock. This will also
            lock out multiclass for this tier.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {availableUpgrades.length === 0 ? (
            <div className="text-muted-foreground py-6 text-center">
              <p>No subclass upgrades available at this tier.</p>
              <p className="mt-2 text-sm">
                Specializations unlock at Tier 3 (level 5+), Masteries at Tier 4
                (level 8+).
              </p>
            </div>
          ) : (
            Object.entries(groupedByClass).map(([classKey, options]) => {
              const className = options[0].className;
              const ClassIcon = ClassIcons[className] ?? Scroll;
              return (
                <div key={classKey} className="space-y-2">
                  <h4 className="flex items-center gap-2 font-medium">
                    <ClassIcon size={20} className={CLASS_COLORS[className]} />
                    <span className={CLASS_COLORS[className]}>{classKey}</span>
                  </h4>
                  <div className="space-y-2">
                    {options.map(option => (
                      <UpgradeOptionCard
                        key={option.feature.name}
                        option={option}
                        isSelected={
                          selectedOption?.feature.name === option.feature.name
                        }
                        onSelect={() => setSelectedOption(option)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedOption}>
            Unlock Feature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
