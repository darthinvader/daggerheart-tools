import { useCallback, useState } from 'react';

import { ClassSelector } from '@/components/class-selector';
import {
  type ClassDetailsData,
  type FeatureUnlockState,
  SingleClassDetails,
} from '@/components/class-selector/class-details';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { getClassByName, getSubclassByName } from '@/lib/data/classes';
import type {
  ClassSelection,
  ClassSubclassPair,
} from '@/lib/schemas/class-selection';
import { CLASS_COLORS, CLASS_EMOJIS } from '@/lib/schemas/class-selection';
import { DOMAIN_COLORS, DOMAIN_EMOJIS } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

function buildClassDetailsData(
  pair: ClassSubclassPair,
  selection: ClassSelection
): ClassDetailsData {
  if (selection.isHomebrew && selection.homebrewClass) {
    const homebrewSubclass = selection.homebrewClass.subclasses.find(
      s => s.name === pair.subclassName
    );
    return {
      className: pair.className,
      subclassName: pair.subclassName,
      spellcastTrait: pair.spellcastTrait,
      description: selection.homebrewClass.description,
      subclassDescription: homebrewSubclass?.description,
      classFeatures: selection.homebrewClass.classFeatures,
      hopeFeature: selection.homebrewClass.hopeFeature,
      subclassFeatures: homebrewSubclass?.features,
      startingHitPoints: selection.homebrewClass.startingHitPoints,
      startingEvasion: selection.homebrewClass.startingEvasion,
      isHomebrew: true,
    };
  }

  const gameClass = getClassByName(pair.className);
  const subclass = getSubclassByName(pair.className, pair.subclassName);

  return {
    className: pair.className,
    subclassName: pair.subclassName,
    spellcastTrait: pair.spellcastTrait,
    description: gameClass?.description,
    subclassDescription: subclass?.description,
    classFeatures: gameClass?.classFeatures,
    hopeFeature: gameClass?.hopeFeature,
    subclassFeatures: subclass?.features,
    startingHitPoints: gameClass?.startingHitPoints,
    startingEvasion: gameClass?.startingEvasion,
    isHomebrew: false,
  };
}

function DomainsCard({
  domains,
  isMulticlass,
}: {
  domains?: string[];
  isMulticlass?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <SmartTooltip
            className="max-w-xs"
            content={
              <p>
                {isMulticlass
                  ? 'Combined domains from all your classes. You can choose domain cards from any of these.'
                  : 'Each class has two domains that determine which domain cards you can choose from.'}
              </p>
            }
          >
            <span className="flex cursor-help items-center gap-2">
              <span>🌐</span>
              <span>Domains</span>
              {isMulticlass && (
                <Badge variant="secondary" className="text-xs">
                  Combined
                </Badge>
              )}
            </span>
          </SmartTooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {domains?.map(domain => {
            const domainEmoji = DOMAIN_EMOJIS[domain] ?? '📜';
            const domainColor = DOMAIN_COLORS[domain] ?? 'text-foreground';
            return (
              <Badge key={domain} variant="outline" className={cn(domainColor)}>
                {domainEmoji} {domain}
              </Badge>
            );
          }) ?? (
            <span className="text-muted-foreground text-sm">No domains</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MulticlassHeader({ classPairs }: { classPairs: ClassSubclassPair[] }) {
  return (
    <div className="rounded-lg border border-purple-500/30 bg-linear-to-r from-purple-500/10 to-blue-500/10 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs">
          🔀 Multiclass
        </Badge>
        {classPairs.map(pair => (
          <Badge
            key={pair.className}
            variant="outline"
            className={cn('text-xs', CLASS_COLORS[pair.className])}
          >
            {CLASS_EMOJIS[pair.className]} {pair.className}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function SelectionDetails({
  selection,
  unlockState,
  onToggleUnlock,
}: {
  selection: ClassSelection;
  unlockState: FeatureUnlockState;
  onToggleUnlock: (featureName: string) => void;
}) {
  const classPairs: ClassSubclassPair[] = selection.classes ?? [
    {
      className: selection.className,
      subclassName: selection.subclassName,
      spellcastTrait: selection.spellcastTrait,
    },
  ];

  return (
    <div className="space-y-6">
      {selection.isMulticlass && <MulticlassHeader classPairs={classPairs} />}
      <DomainsCard
        domains={selection.domains}
        isMulticlass={selection.isMulticlass}
      />

      {classPairs.map((pair, index) => (
        <div key={pair.className}>
          {index > 0 && <Separator className="my-4" />}
          <SingleClassDetails
            data={buildClassDetailsData(pair, selection)}
            unlockState={unlockState}
            onToggleUnlock={onToggleUnlock}
          />
        </div>
      ))}
    </div>
  );
}

export function ClassSelectorDemo() {
  const [selection, setSelection] = useState<ClassSelection | null>(null);
  const [unlockState, setUnlockState] = useState<FeatureUnlockState>({});

  const handleComplete = (sel: ClassSelection) => {
    setSelection(sel);
    setUnlockState({});
  };

  const handleToggleUnlock = useCallback((featureName: string) => {
    setUnlockState(prev => ({
      ...prev,
      [featureName]: !prev[featureName],
    }));
  }, []);

  return (
    <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Class & Subclass Selector</h3>
        <div className="bg-card rounded-lg border p-4">
          <ClassSelector onComplete={handleComplete} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Selection</h3>
        <div className="bg-card max-h-[80vh] overflow-y-auto rounded-lg border p-4 xl:sticky xl:top-4">
          {selection ? (
            <SelectionDetails
              selection={selection}
              unlockState={unlockState}
              onToggleUnlock={handleToggleUnlock}
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              No class selected yet. Choose a class and subclass to see the
              details here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
