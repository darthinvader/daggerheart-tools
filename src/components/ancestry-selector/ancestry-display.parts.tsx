import { useCallback, useMemo, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
import {
  Blend,
  BookOpen,
  PersonStanding,
  Ruler,
  Sparkles,
  Star,
  Theater,
} from '@/lib/icons';
import type {
  Ancestry,
  AncestrySelection,
  MixedAncestry,
} from '@/lib/schemas/identity';
import { getAncestryByName } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import { AncestrySelector } from './ancestry-selector';
import { FeatureCard } from './feature-card';
import { HomebrewAncestryContent } from './homebrew-ancestry-content';

// Validate if an ancestry selection is complete and saveable
function isStandardAncestryValid(selection: AncestrySelection): boolean {
  if (!selection || selection.mode !== 'standard') return false;
  return Boolean(selection.ancestry?.name);
}

function isMixedAncestryValid(mixed: MixedAncestry | undefined): boolean {
  if (!mixed) return false;
  const hasName = Boolean(mixed.name?.trim());
  const hasParents = (mixed.parentAncestries?.length ?? 0) >= 2;
  const hasFeatures = Boolean(
    mixed.primaryFeature?.name && mixed.secondaryFeature?.name
  );
  return hasName && hasParents && hasFeatures;
}

function isHomebrewAncestryValid(selection: AncestrySelection): boolean {
  if (!selection || selection.mode !== 'homebrew') return false;
  const homebrew = selection.homebrew;
  if (!homebrew) return false;
  const hasName = Boolean(homebrew.name?.trim());
  const hasPrimary = Boolean(homebrew.primaryFeature?.name?.trim());
  const hasSecondary = Boolean(homebrew.secondaryFeature?.name?.trim());
  return hasName && hasPrimary && hasSecondary;
}

function isAncestrySelectionValid(selection: AncestrySelection): boolean {
  if (!selection) return false;
  switch (selection.mode) {
    case 'standard':
      return isStandardAncestryValid(selection);
    case 'mixed':
      return isMixedAncestryValid(selection.mixedAncestry);
    case 'homebrew':
      return isHomebrewAncestryValid(selection);
    default:
      return false;
  }
}

interface AncestryDisplayProps {
  selection: AncestrySelection;
  onChange?: (selection: AncestrySelection) => void;
  className?: string;
  readOnly?: boolean;
}

function EmptyAncestry({ onEdit }: { onEdit?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <PersonStanding className="size-10 opacity-50" />
      <p className="text-muted-foreground mt-2">No ancestry selected</p>
      <p className="text-muted-foreground mb-4 text-sm">
        Choose your character's heritage
      </p>
      {onEdit && (
        <Button variant="outline" onClick={onEdit}>
          <PersonStanding className="mr-1 size-4" /> Select Ancestry
        </Button>
      )}
    </div>
  );
}

function StandardAncestryContent({
  ancestry,
  disabledFeatures,
  onToggleFeature,
}: {
  ancestry: Ancestry;
  disabledFeatures?: Set<string>;
  onToggleFeature?: (featureName: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-xl font-bold">{ancestry.name}</h4>
        <Badge variant="secondary" className="gap-1">
          <BookOpen className="size-3" /> Standard
        </Badge>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <SmartTooltip content="Typical height range for this ancestry">
          <span className="bg-muted flex items-center gap-1 rounded-full px-3 py-1">
            <Ruler className="size-4" /> {ancestry.heightRange}
          </span>
        </SmartTooltip>
        <SmartTooltip content="Average lifespan">
          <span className="bg-muted flex items-center gap-1 rounded-full px-3 py-1">
            ⏳ {ancestry.lifespan}
          </span>
        </SmartTooltip>
      </div>

      <Separator />

      <div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {ancestry.description}
        </p>
      </div>

      <Separator />

      <div>
        <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          ⚔️ Ancestry Features
        </h5>
        <div className="grid gap-3 md:grid-cols-2">
          <FeatureCard
            feature={ancestry.primaryFeature}
            variant="primary"
            isActivated={!disabledFeatures?.has(ancestry.primaryFeature.name)}
            onToggleActivated={
              onToggleFeature
                ? () => onToggleFeature(ancestry.primaryFeature.name)
                : undefined
            }
          />
          <FeatureCard
            feature={ancestry.secondaryFeature}
            variant="secondary"
            isActivated={!disabledFeatures?.has(ancestry.secondaryFeature.name)}
            onToggleActivated={
              onToggleFeature
                ? () => onToggleFeature(ancestry.secondaryFeature.name)
                : undefined
            }
          />
        </div>
      </div>

      {ancestry.physicalCharacteristics.length > 0 && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              <Theater className="size-4" /> Physical Characteristics
            </h5>
            <div className="flex flex-wrap gap-2">
              {ancestry.physicalCharacteristics.map(char => (
                <Badge key={char} variant="outline" className="text-xs">
                  {char}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MixedAncestryContent({
  mixedAncestry,
  disabledFeatures,
  onToggleFeature,
}: {
  mixedAncestry: MixedAncestry;
  disabledFeatures?: Set<string>;
  onToggleFeature?: (featureName: string) => void;
}) {
  const parentAncestries = mixedAncestry.parentAncestries ?? [];
  const primaryParent = parentAncestries[0]
    ? getAncestryByName(parentAncestries[0])
    : undefined;
  const secondaryParent = parentAncestries[1]
    ? getAncestryByName(parentAncestries[1])
    : undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-xl font-bold">
          {mixedAncestry.name || 'Mixed Ancestry'}
        </h4>
        <Badge
          variant="secondary"
          className="gap-1 border-purple-300 bg-purple-100 text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
        >
          <Blend className="size-4" /> Mixed
        </Badge>
      </div>

      {parentAncestries.length >= 2 && (
        <div className="flex flex-wrap gap-2">
          <SmartTooltip content="Parent ancestry providing the primary feature">
            <Badge
              variant="outline"
              className="border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/30"
            >
              <Star className="size-4 text-amber-600 dark:text-amber-400" />{' '}
              {parentAncestries[0]}
            </Badge>
          </SmartTooltip>
          <span className="text-muted-foreground">+</span>
          <SmartTooltip content="Parent ancestry providing the secondary feature">
            <Badge
              variant="outline"
              className="border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
            >
              <Sparkles className="size-4 text-blue-600 dark:text-blue-400" />{' '}
              {parentAncestries[1]}
            </Badge>
          </SmartTooltip>
        </div>
      )}

      <Separator />

      {(primaryParent || secondaryParent) && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {primaryParent && (
              <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
                <h6 className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
                  <Star className="size-4" /> {primaryParent.name}
                </h6>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <p className="flex items-center gap-1">
                    <Ruler className="size-3" /> {primaryParent.heightRange}
                  </p>
                  <p>⏳ {primaryParent.lifespan}</p>
                </div>
              </div>
            )}

            {secondaryParent && (
              <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                <h6 className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                  <Sparkles className="size-4" /> {secondaryParent.name}
                </h6>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <p className="flex items-center gap-1">
                    <Ruler className="size-3" /> {secondaryParent.heightRange}
                  </p>
                  <p>⏳ {secondaryParent.lifespan}</p>
                </div>
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      <div>
        <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          ⚔️ Ancestry Features
        </h5>
        <div className="grid gap-3 md:grid-cols-2">
          <FeatureCard
            feature={mixedAncestry.primaryFeature}
            variant="primary"
            isActivated={
              !disabledFeatures?.has(mixedAncestry.primaryFeature.name)
            }
            onToggleActivated={
              onToggleFeature
                ? () => onToggleFeature(mixedAncestry.primaryFeature.name)
                : undefined
            }
          />
          <FeatureCard
            feature={mixedAncestry.secondaryFeature}
            variant="secondary"
            isActivated={
              !disabledFeatures?.has(mixedAncestry.secondaryFeature.name)
            }
            onToggleActivated={
              onToggleFeature
                ? () => onToggleFeature(mixedAncestry.secondaryFeature.name)
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}

function AncestryContent({
  selection,
  onEdit,
  disabledFeatures,
  onToggleFeature,
}: {
  selection: AncestrySelection;
  onEdit?: () => void;
  disabledFeatures?: Set<string>;
  onToggleFeature?: (featureName: string) => void;
}) {
  if (!selection) {
    return <EmptyAncestry onEdit={onEdit} />;
  }

  switch (selection.mode) {
    case 'standard':
      if (!selection.ancestry) return <EmptyAncestry onEdit={onEdit} />;
      return (
        <StandardAncestryContent
          ancestry={selection.ancestry}
          disabledFeatures={disabledFeatures}
          onToggleFeature={onToggleFeature}
        />
      );
    case 'mixed':
      if (!selection.mixedAncestry) return <EmptyAncestry onEdit={onEdit} />;
      return (
        <MixedAncestryContent
          mixedAncestry={selection.mixedAncestry}
          disabledFeatures={disabledFeatures}
          onToggleFeature={onToggleFeature}
        />
      );
    case 'homebrew':
      if (!selection.homebrew) return <EmptyAncestry onEdit={onEdit} />;
      return <HomebrewAncestryContent ancestry={selection.homebrew} />;
    default:
      return <EmptyAncestry onEdit={onEdit} />;
  }
}

export function AncestryDisplay({
  selection,
  onChange,
  className,
  readOnly = false,
}: AncestryDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSelection, setDraftSelection] =
    useState<AncestrySelection>(selection);

  const canSave = useMemo(
    () => isAncestrySelectionValid(draftSelection),
    [draftSelection]
  );

  const disabledFeatures = useMemo(
    () => new Set(selection?.disabledFeatures ?? []),
    [selection?.disabledFeatures]
  );

  const handleToggleFeature = useCallback(
    (featureName: string) => {
      if (!selection || !onChange) return;
      const current = new Set(selection.disabledFeatures ?? []);
      if (current.has(featureName)) {
        current.delete(featureName);
      } else {
        current.add(featureName);
      }
      onChange({
        ...selection,
        disabledFeatures: Array.from(current),
      });
    },
    [selection, onChange]
  );

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setDraftSelection(selection);
    }
    setIsEditing(prev => !prev);
  }, [isEditing, selection]);

  const handleSave = useCallback(() => {
    onChange?.(draftSelection);
  }, [draftSelection, onChange]);

  const handleCancel = useCallback(() => {
    setDraftSelection(selection);
  }, [selection]);

  const handleChange = useCallback((newSelection: AncestrySelection) => {
    setDraftSelection(newSelection);
  }, []);

  return (
    <EditableSection
      title="Ancestry"
      icon={PersonStanding}
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onCancel={handleCancel}
      showEditButton={!readOnly}
      modalSize="xl"
      className={cn(className)}
      editTitle="Choose Your Ancestry"
      editDescription="Select a standard ancestry, create a mixed heritage, or design your own homebrew ancestry."
      canSave={canSave}
      editContent={
        <AncestrySelector value={draftSelection} onChange={handleChange} />
      }
    >
      <AncestryContent
        selection={selection}
        onEdit={!readOnly ? handleEditToggle : undefined}
        disabledFeatures={disabledFeatures}
        onToggleFeature={handleToggleFeature}
      />
    </EditableSection>
  );
}
