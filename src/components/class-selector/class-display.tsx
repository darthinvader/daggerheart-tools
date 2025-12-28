import { useCallback, useRef, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import { getClassByName, getSubclassByName } from '@/lib/data/classes';
import type {
  ClassDraft,
  ClassSelection,
  ClassSubclassPair,
} from '@/lib/schemas/class-selection';
import {
  CLASS_BG_COLORS,
  CLASS_COLORS,
  CLASS_EMOJIS,
} from '@/lib/schemas/class-selection';
import { DOMAIN_COLORS, DOMAIN_EMOJIS } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

import type { ClassDetailsData, FeatureUnlockState } from './class-details';
import { SingleClassDetails } from './class-details';
import { ClassSelector } from './class-selector';

interface ClassDisplayProps {
  selection: ClassSelection | null;
  onChange?: (selection: ClassSelection) => void;
  className?: string;
  readOnly?: boolean;
}

function EmptyClass() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <span className="text-4xl opacity-50">⚔️</span>
      <p className="text-muted-foreground mt-2">No class selected</p>
      <p className="text-muted-foreground text-sm">
        Click edit to choose your character&apos;s class
      </p>
    </div>
  );
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
                  ? 'Combined domains from all your classes.'
                  : 'Your class domains determine which cards you can choose.'}
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

function ClassContent({
  selection,
  unlockState,
  onToggleUnlock,
}: {
  selection: ClassSelection | null;
  unlockState: FeatureUnlockState;
  onToggleUnlock: (featureName: string) => void;
}) {
  if (!selection) {
    return <EmptyClass />;
  }

  const classPairs: ClassSubclassPair[] = selection.classes ?? [
    {
      className: selection.className,
      subclassName: selection.subclassName,
      spellcastTrait: selection.spellcastTrait,
    },
  ];

  const primaryClass = classPairs[0];
  const emoji = CLASS_EMOJIS[primaryClass.className] ?? '⚔️';
  const bgColors = CLASS_BG_COLORS[primaryClass.className] ?? '';

  return (
    <div className="space-y-4">
      <div className={cn('rounded-lg border p-4', bgColors)}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <h4
              className={cn(
                'text-xl font-bold',
                CLASS_COLORS[primaryClass.className]
              )}
            >
              {primaryClass.className}
            </h4>
            <p className="text-muted-foreground text-sm">
              {primaryClass.subclassName}
            </p>
          </div>
          {selection.isHomebrew && (
            <Badge variant="secondary" className="gap-1">
              🛠️ Homebrew
            </Badge>
          )}
        </div>
      </div>

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

export function ClassDisplay({
  selection,
  onChange,
  className,
  readOnly = false,
}: ClassDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSelection, setDraftSelection] = useState<ClassDraft>({
    mode: selection?.mode ?? 'standard',
    className: selection?.className,
    subclassName: selection?.subclassName,
    homebrewClass: selection?.homebrewClass,
  });
  const [pendingSelection, setPendingSelection] =
    useState<ClassSelection | null>(null);
  const [unlockState, setUnlockState] = useState<FeatureUnlockState>({});
  const completeRef = useRef<{
    complete: () => ClassSelection | null;
  } | null>(null);

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setDraftSelection({
        mode: selection?.mode ?? 'standard',
        className: selection?.className,
        subclassName: selection?.subclassName,
        homebrewClass: selection?.homebrewClass,
      });
      setPendingSelection(null);
    }
    setIsEditing(prev => !prev);
  }, [isEditing, selection]);

  const handleSave = useCallback(() => {
    const newSelection = completeRef.current?.complete();
    if (newSelection) {
      onChange?.(newSelection);
    } else if (pendingSelection) {
      onChange?.(pendingSelection);
    }
  }, [pendingSelection, onChange]);

  const handleCancel = useCallback(() => {
    setPendingSelection(null);
    setDraftSelection({
      mode: selection?.mode ?? 'standard',
      className: selection?.className,
      subclassName: selection?.subclassName,
      homebrewClass: selection?.homebrewClass,
    });
  }, [selection]);

  const handleComplete = useCallback((newSelection: ClassSelection) => {
    setPendingSelection(newSelection);
  }, []);

  const handleDraftChange = useCallback((draft: ClassDraft) => {
    setDraftSelection(draft);
  }, []);

  const handleToggleUnlock = useCallback((featureName: string) => {
    setUnlockState(prev => ({
      ...prev,
      [featureName]: !prev[featureName],
    }));
  }, []);

  return (
    <EditableSection
      title="Class"
      emoji="⚔️"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onCancel={handleCancel}
      showEditButton={!readOnly}
      modalSize="xl"
      className={cn(className)}
      editTitle="Choose Your Class"
      editDescription="Select your class and subclass, then click Save."
      editContent={
        <ClassSelector
          value={draftSelection}
          onChange={handleDraftChange}
          onComplete={handleComplete}
          hideCompleteButton
          completeRef={completeRef}
        />
      }
    >
      <ClassContent
        selection={selection}
        unlockState={unlockState}
        onToggleUnlock={handleToggleUnlock}
      />
    </EditableSection>
  );
}
