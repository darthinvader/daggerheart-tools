import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SmartTooltip } from '@/components/ui/smart-tooltip';
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

interface AncestryDisplayProps {
  selection: AncestrySelection;
  onChange?: (selection: AncestrySelection) => void;
  className?: string;
  readOnly?: boolean;
}

function EmptyAncestry({ onEdit }: { onEdit?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <span className="text-4xl opacity-50">🧬</span>
      <p className="text-muted-foreground mt-2">No ancestry selected</p>
      <p className="text-muted-foreground mb-4 text-sm">
        Choose your character's heritage
      </p>
      {onEdit && (
        <Button variant="outline" onClick={onEdit}>
          🧬 Select Ancestry
        </Button>
      )}
    </div>
  );
}

function StandardAncestryContent({ ancestry }: { ancestry: Ancestry }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-xl font-bold">{ancestry.name}</h4>
        <Badge variant="secondary" className="gap-1">
          📖 Standard
        </Badge>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <SmartTooltip content="Typical height range for this ancestry">
          <span className="bg-muted flex items-center gap-1 rounded-full px-3 py-1">
            📏 {ancestry.heightRange}
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
          <FeatureCard feature={ancestry.primaryFeature} variant="primary" />
          <FeatureCard
            feature={ancestry.secondaryFeature}
            variant="secondary"
          />
        </div>
      </div>

      {ancestry.physicalCharacteristics.length > 0 && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              🎭 Physical Characteristics
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
}: {
  mixedAncestry: MixedAncestry;
}) {
  const primaryParent = getAncestryByName(mixedAncestry.parentAncestries[0]);
  const secondaryParent = getAncestryByName(mixedAncestry.parentAncestries[1]);

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
          🔀 Mixed
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <SmartTooltip content="Parent ancestry providing the primary feature">
          <Badge
            variant="outline"
            className="border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/30"
          >
            ⭐ {mixedAncestry.parentAncestries[0]}
          </Badge>
        </SmartTooltip>
        <span className="text-muted-foreground">+</span>
        <SmartTooltip content="Parent ancestry providing the secondary feature">
          <Badge
            variant="outline"
            className="border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
          >
            ✨ {mixedAncestry.parentAncestries[1]}
          </Badge>
        </SmartTooltip>
      </div>

      <Separator />

      {(primaryParent || secondaryParent) && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {primaryParent && (
              <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
                <h6 className="flex items-center gap-2 font-medium text-amber-600 dark:text-amber-400">
                  ⭐ {primaryParent.name}
                </h6>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <p>📏 {primaryParent.heightRange}</p>
                  <p>⏳ {primaryParent.lifespan}</p>
                </div>
              </div>
            )}

            {secondaryParent && (
              <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                <h6 className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-400">
                  ✨ {secondaryParent.name}
                </h6>
                <div className="text-muted-foreground space-y-1 text-xs">
                  <p>📏 {secondaryParent.heightRange}</p>
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
          />
          <FeatureCard
            feature={mixedAncestry.secondaryFeature}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
}

function AncestryContent({
  selection,
  onEdit,
}: {
  selection: AncestrySelection;
  onEdit?: () => void;
}) {
  if (!selection) {
    return <EmptyAncestry onEdit={onEdit} />;
  }

  switch (selection.mode) {
    case 'standard':
      if (!selection.ancestry) return <EmptyAncestry onEdit={onEdit} />;
      return <StandardAncestryContent ancestry={selection.ancestry} />;
    case 'mixed':
      if (!selection.mixedAncestry) return <EmptyAncestry onEdit={onEdit} />;
      return <MixedAncestryContent mixedAncestry={selection.mixedAncestry} />;
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
      emoji="🧬"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onCancel={handleCancel}
      showEditButton={!readOnly}
      modalSize="xl"
      className={cn(className)}
      editTitle="Choose Your Ancestry"
      editDescription="Select a standard ancestry, create a mixed heritage, or design your own homebrew ancestry."
      editContent={
        <AncestrySelector value={draftSelection} onChange={handleChange} />
      }
    >
      <AncestryContent
        selection={selection}
        onEdit={!readOnly ? handleEditToggle : undefined}
      />
    </EditableSection>
  );
}
