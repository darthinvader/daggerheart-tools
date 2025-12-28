import { useCallback, useMemo, useRef, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getClassByName, getSubclassByName } from '@/lib/data/classes';
import type {
  ClassDraft,
  ClassSelection,
  ClassSubclassPair,
} from '@/lib/schemas/class-selection';
import { CLASS_COLORS, CLASS_EMOJIS } from '@/lib/schemas/class-selection';
import { cn } from '@/lib/utils';

import type { ClassDetailsData, FeatureUnlockState } from './class-details';
import { SingleClassDetails } from './class-details';
import { ClassSelector } from './class-selector';

interface ClassDisplayProps {
  selection: ClassSelection | null;
  onChange?: (selection: ClassSelection) => void;
  className?: string;
  readOnly?: boolean;
  unlockedSubclassFeatures?: Record<string, string[]>;
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
      domains: selection.domains,
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
    domains: selection.domains,
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

  return (
    <div className="space-y-4">
      {selection.isMulticlass && <MulticlassHeader classPairs={classPairs} />}

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
  unlockedSubclassFeatures = {},
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
  const [localUnlockState, setLocalUnlockState] = useState<FeatureUnlockState>(
    {}
  );
  const completeRef = useRef<{
    complete: () => ClassSelection | null;
  } | null>(null);

  const unlockState = useMemo<FeatureUnlockState>(() => {
    const state: FeatureUnlockState = { ...localUnlockState };
    for (const [key, features] of Object.entries(unlockedSubclassFeatures)) {
      const [clsName] = key.split(':');
      for (const featureName of features) {
        state[`${clsName}:${featureName}`] = true;
      }
    }
    return state;
  }, [localUnlockState, unlockedSubclassFeatures]);

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
    setLocalUnlockState(prev => ({
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
