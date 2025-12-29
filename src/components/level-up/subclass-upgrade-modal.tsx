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
import { getSubclassByName } from '@/lib/data/classes';
import {
  CLASS_COLORS,
  CLASS_EMOJIS,
  type ClassSubclassPair,
} from '@/lib/schemas/class-selection';

import type { SubclassUpgradeSelection } from './types';
import { type UpgradeOption, UpgradeOptionCard } from './upgrade-option-card';

export type SubclassUpgradeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (upgrade: SubclassUpgradeSelection) => void;
  classes: ClassSubclassPair[];
  unlockedFeatures: Record<string, string[]>;
  targetTier: string;
};

function getAvailableUpgrades(
  classes: ClassSubclassPair[],
  unlockedFeatures: Record<string, string[]>,
  targetTier: string
): UpgradeOption[] {
  const options: UpgradeOption[] = [];

  for (const classPair of classes) {
    const subclass = getSubclassByName(
      classPair.className,
      classPair.subclassName
    );
    if (!subclass) continue;

    const key = `${classPair.className}:${classPair.subclassName}`;
    const unlocked = unlockedFeatures[key] ?? [];

    const foundationFeatures = subclass.features.filter(
      f => f.type === 'foundation'
    );
    const specializationFeatures = subclass.features.filter(
      f => f.type === 'specialization'
    );
    const masteryFeatures = subclass.features.filter(f => f.type === 'mastery');

    const hasFoundation = foundationFeatures.length > 0;
    const hasUnlockedSpecialization = specializationFeatures.some(f =>
      unlocked.includes(f.name)
    );
    const hasUnlockedMastery = masteryFeatures.some(f =>
      unlocked.includes(f.name)
    );

    const canUpgradeToSpecialization =
      hasFoundation &&
      !hasUnlockedSpecialization &&
      (targetTier === '5-7' || targetTier === '8-10');

    if (canUpgradeToSpecialization) {
      for (const feature of specializationFeatures) {
        if (!unlocked.includes(feature.name)) {
          options.push({
            className: classPair.className,
            subclassName: classPair.subclassName,
            feature,
            upgradeType: 'specialization',
          });
        }
      }
    }

    const canUpgradeToMastery =
      hasUnlockedSpecialization && !hasUnlockedMastery && targetTier === '8-10';

    if (canUpgradeToMastery) {
      for (const feature of masteryFeatures) {
        if (!unlocked.includes(feature.name)) {
          options.push({
            className: classPair.className,
            subclassName: classPair.subclassName,
            feature,
            upgradeType: 'mastery',
          });
        }
      }
    }
  }

  return options;
}

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

  const groupedByClass = useMemo(() => {
    const grouped: Record<string, UpgradeOption[]> = {};
    for (const option of availableUpgrades) {
      const key = `${option.className} - ${option.subclassName}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(option);
    }
    return grouped;
  }, [availableUpgrades]);

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
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col overflow-hidden">
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
              return (
                <div key={classKey} className="space-y-2">
                  <h4 className="flex items-center gap-2 font-medium">
                    <span>{CLASS_EMOJIS[className] ?? '📜'}</span>
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
