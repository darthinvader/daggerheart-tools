import { useCallback, useState } from 'react';

import { EditableSection } from '@/components/shared/editable-section';
import { TraitsIcon } from '@/components/shared/icons';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Community, CommunitySelection } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import { getCommunityColors, getCommunityEmoji } from './community-config';
import { CommunityFeatureDisplay } from './community-feature-display';
import { CommunitySelector } from './community-selector';

interface CommunityDisplayProps {
  selection: CommunitySelection;
  onChange?: (selection: CommunitySelection) => void;
  className?: string;
  readOnly?: boolean;
}

function EmptyCommunity() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <span className="text-4xl opacity-50">🏘️</span>
      <p className="text-muted-foreground mt-2">No community selected</p>
      <p className="text-muted-foreground text-sm">
        Click edit to choose your character&apos;s community
      </p>
    </div>
  );
}

function StandardCommunityContent({ community }: { community: Community }) {
  const colors = getCommunityColors(community.name);
  const emoji = getCommunityEmoji(community.name);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-3xl">{emoji}</span>
        <h4 className={cn('text-xl font-bold', colors.text)}>
          {community.name}
        </h4>
        <Badge variant="secondary" className="gap-1">
          📖 Standard
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
          ⚔️ Community Feature
        </h5>
        <CommunityFeatureDisplay
          feature={community.feature}
          communityName={community.name}
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

function HomebrewCommunityContent({ community }: { community: Community }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-3xl">✨</span>
        <h4 className="text-xl font-bold">
          {community.name || '(Unnamed Homebrew)'}
        </h4>
        <Badge
          variant="secondary"
          className="gap-1 border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
        >
          🛠️ Homebrew
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
              ⚔️ Community Feature
            </h5>
            <CommunityFeatureDisplay feature={community.feature} />
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

function CommunityContent({ selection }: { selection: CommunitySelection }) {
  if (!selection) {
    return <EmptyCommunity />;
  }

  switch (selection.mode) {
    case 'standard':
      return <StandardCommunityContent community={selection.community} />;
    case 'homebrew':
      return <HomebrewCommunityContent community={selection.homebrew} />;
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

  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      onChange?.(draftSelection);
    } else {
      setDraftSelection(selection);
    }
    setIsEditing(prev => !prev);
  }, [isEditing, draftSelection, selection, onChange]);

  const handleChange = useCallback((newSelection: CommunitySelection) => {
    setDraftSelection(newSelection);
  }, []);

  return (
    <EditableSection
      title="Community"
      emoji="🏘️"
      isEditing={isEditing}
      onEditToggle={handleEditToggle}
      showEditButton={!readOnly}
      modalSize="lg"
      className={cn(className)}
      editTitle="Choose Your Community"
      editDescription="Select a standard community or create your own homebrew community."
      editContent={
        <CommunitySelector value={draftSelection} onChange={handleChange} />
      }
    >
      <CommunityContent selection={selection} />
    </EditableSection>
  );
}
