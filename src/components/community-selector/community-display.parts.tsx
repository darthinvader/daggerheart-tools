import { useCallback, useMemo, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { TraitsIcon } from '@/components/shared/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Book, DynamicIcon, Home, Sparkles, Sword, Wrench } from '@/lib/icons';
import type { Community, CommunitySelection } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import { getCommunityColors, getCommunityIcon } from './community-config';
import { CommunityFeatureDisplay } from './community-feature-display';
import { CommunitySelector } from './community-selector';

// Validate if a community selection is complete and saveable
function isCommunitySelectionValid(selection: CommunitySelection): boolean {
  if (!selection) return false;

  if (selection.mode === 'standard') {
    return Boolean(selection.community?.name);
  }

  if (selection.mode === 'homebrew') {
    const homebrew = selection.homebrew;
    return Boolean(
      homebrew?.name?.trim() &&
      homebrew?.feature?.name?.trim() &&
      homebrew?.feature?.description?.trim()
    );
  }

  return false;
}

interface CommunityDisplayProps {
  selection: CommunitySelection;
  onChange?: (selection: CommunitySelection) => void;
  className?: string;
  readOnly?: boolean;
}

function EmptyCommunity({ onEdit }: { onEdit?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Home className="size-10 opacity-50" />
      <p className="text-muted-foreground mt-2">No community selected</p>
      <p className="text-muted-foreground mb-4 text-sm">
        Choose where your character comes from
      </p>
      {onEdit && (
        <Button variant="outline" onClick={onEdit} className="gap-2">
          <Home className="size-4" /> Select Community
        </Button>
      )}
    </div>
  );
}

function StandardCommunityContent({
  community,
  isFeatureDisabled,
  onToggleFeature,
  readOnly,
}: {
  community: Community;
  isFeatureDisabled?: boolean;
  onToggleFeature?: () => void;
  readOnly?: boolean;
}) {
  const colors = getCommunityColors(community.name);
  const icon = getCommunityIcon(community.name);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <DynamicIcon icon={icon} className="size-8" />
        <h4 className={cn('text-xl font-bold', colors.text)}>
          {community.name}
        </h4>
        <Badge variant="secondary" className="gap-1">
          <Book className="size-3" /> Standard
        </Badge>
      </div>

      <Separator />

      <div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {community.description}
        </p>
      </div>

      <Separator />

      <div>
        <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          <Sword className="size-4" /> Community Feature
        </h5>
        <CommunityFeatureDisplay
          feature={community.feature}
          communityName={community.name}
          isActivated={!isFeatureDisabled}
          onToggleActivated={!readOnly ? onToggleFeature : undefined}
        />
      </div>

      <Separator />

      <div>
        <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          <TraitsIcon /> Common Traits
        </h5>
        <div className="flex flex-wrap gap-2">
          {community.commonTraits.map(trait => (
            <Badge
              key={trait}
              variant="outline"
              className={cn('text-xs capitalize', colors.border, colors.bg)}
            >
              {trait}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomebrewCommunityContent({
  community,
  isFeatureDisabled,
  onToggleFeature,
  readOnly,
}: {
  community: Community;
  isFeatureDisabled?: boolean;
  onToggleFeature?: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Sparkles className="size-8" />
        <h4 className="text-xl font-bold">
          {community.name || '(Unnamed Homebrew)'}
        </h4>
        <Badge
          variant="secondary"
          className="gap-1 border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
        >
          <Wrench className="size-3" /> Homebrew
        </Badge>
      </div>

      {community.description && (
        <>
          <Separator />
          <p className="text-muted-foreground text-sm leading-relaxed">
            {community.description}
          </p>
        </>
      )}

      {community.feature?.name && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              <Sword className="size-4" /> Community Feature
            </h5>
            <CommunityFeatureDisplay
              feature={community.feature}
              isActivated={!isFeatureDisabled}
              onToggleActivated={!readOnly ? onToggleFeature : undefined}
            />
          </div>
        </>
      )}

      {community.commonTraits?.length > 0 && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
              <TraitsIcon /> Common Traits
            </h5>
            <div className="flex flex-wrap gap-2">
              {community.commonTraits.map(trait => (
                <Badge
                  key={trait}
                  variant="outline"
                  className="text-xs capitalize"
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CommunityContent({
  selection,
  onEdit,
  isFeatureDisabled,
  onToggleFeature,
  readOnly,
}: {
  selection: CommunitySelection;
  onEdit?: () => void;
  isFeatureDisabled?: boolean;
  onToggleFeature?: () => void;
  readOnly?: boolean;
}) {
  if (!selection) {
    return <EmptyCommunity onEdit={onEdit} />;
  }

  switch (selection.mode) {
    case 'standard':
      if (!selection.community) return <EmptyCommunity onEdit={onEdit} />;
      return (
        <StandardCommunityContent
          community={selection.community}
          isFeatureDisabled={isFeatureDisabled}
          onToggleFeature={onToggleFeature}
          readOnly={readOnly}
        />
      );
    case 'homebrew':
      if (!selection.homebrew) return <EmptyCommunity onEdit={onEdit} />;
      return (
        <HomebrewCommunityContent
          community={selection.homebrew}
          isFeatureDisabled={isFeatureDisabled}
          onToggleFeature={onToggleFeature}
          readOnly={readOnly}
        />
      );
    default:
      return <EmptyCommunity onEdit={onEdit} />;
  }
}

export function CommunityDisplay({
  selection,
  onChange,
  className,
  readOnly = false,
}: CommunityDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSelection, setDraftSelection] =
    useState<CommunitySelection>(selection);

  const canSave = useMemo(
    () => isCommunitySelectionValid(draftSelection),
    [draftSelection]
  );

  // Get the feature name for this community (for disabledFeatures check)
  const featureName = useMemo(() => {
    if (!selection) return null;
    if (selection.mode === 'standard' && selection.community) {
      return selection.community.feature.name;
    }
    if (selection.mode === 'homebrew' && selection.homebrew) {
      return selection.homebrew.feature.name;
    }
    return null;
  }, [selection]);

  const isFeatureDisabled = useMemo(() => {
    if (!featureName || !selection) return false;
    return selection.disabledFeatures?.includes(featureName) ?? false;
  }, [selection, featureName]);

  const handleToggleFeature = useCallback(() => {
    if (!selection || !onChange || !featureName) return;
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
  }, [selection, onChange, featureName]);

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

  const handleChange = useCallback((newSelection: CommunitySelection) => {
    setDraftSelection(newSelection);
  }, []);

  return (
    <EditableSection
      title="Community"
      icon={Home}
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onCancel={handleCancel}
      showEditButton={!readOnly}
      modalSize="lg"
      className={cn(className)}
      editTitle="Choose Your Community"
      editDescription="Select a standard community or create your own homebrew community."
      canSave={canSave}
      editContent={
        <CommunitySelector value={draftSelection} onChange={handleChange} />
      }
    >
      <CommunityContent
        selection={selection}
        onEdit={!readOnly ? handleEditToggle : undefined}
        isFeatureDisabled={isFeatureDisabled}
        onToggleFeature={!readOnly ? handleToggleFeature : undefined}
        readOnly={readOnly}
      />
    </EditableSection>
  );
}
