import { useState } from 'react';

import {
  CommunityFeatureDisplay,
  type CommunitySelection,
  CommunitySelector,
  getCommunityColors,
  getCommunityEmoji,
} from '@/components/community-selector';
import { TraitsIcon } from '@/components/shared/icons';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

function StandardSelectionDetails({
  selection,
}: {
  selection: Extract<CommunitySelection, { mode: 'standard' }>;
}) {
  const { community } = selection;
  const colors = getCommunityColors(community.name);
  const emoji = getCommunityEmoji(community.name);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <h4 className={cn('text-xl font-semibold', colors.text)}>
          {community.name}
        </h4>
      </div>

      <Separator />

      <div>
        <h5 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          📖 Description
        </h5>
        <p className="text-muted-foreground text-sm">{community.description}</p>
      </div>

      <Separator />

      <div>
        <h5 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
          ⚔️ Community Feature
        </h5>
        <CommunityFeatureDisplay
          feature={community.feature}
          communityName={community.name}
        />
      </div>

      <Separator />

      <div>
        <h5 className="mb-3 flex items-center gap-2 font-semibold">
          <TraitsIcon /> Common Traits
        </h5>
        <div className="flex flex-wrap gap-2">
          {community.commonTraits.map(trait => (
            <span
              key={trait}
              className={cn(
                'rounded-full border px-3 py-1 text-sm capitalize',
                colors.border,
                colors.bg,
                colors.accent
              )}
            >
              {trait}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomebrewSelectionDetails({
  selection,
}: {
  selection: Extract<CommunitySelection, { mode: 'homebrew' }>;
}) {
  const { homebrew } = selection;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">✨</span>
        <h4 className="text-xl font-semibold">
          {homebrew.name || 'Unnamed Community'}
        </h4>
      </div>

      {homebrew.description && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
              📖 Description
            </h5>
            <p className="text-muted-foreground text-sm">
              {homebrew.description}
            </p>
          </div>
        </>
      )}

      {homebrew.feature.name && (
        <>
          <Separator />
          <div>
            <h5 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
              ⚔️ Community Feature
            </h5>
            <CommunityFeatureDisplay feature={homebrew.feature} />
          </div>
        </>
      )}

      {homebrew.commonTraits.length > 0 && (
        <>
          <Separator />
          <div>
            <h5 className="mb-3 flex items-center gap-2 font-semibold">
              <TraitsIcon /> Common Traits
            </h5>
            <div className="flex flex-wrap gap-2">
              {homebrew.commonTraits.map(trait => (
                <span
                  key={trait}
                  className="text-muted-foreground rounded-full border px-3 py-1 text-sm capitalize"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function CommunitySelectorDemo() {
  const [selection, setSelection] = useState<CommunitySelection>(null);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">Community Selection</h3>
        <CommunitySelector value={selection} onChange={setSelection} />
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-semibold">Selection Preview</h3>
        {selection === null ? (
          <p className="text-muted-foreground">
            No community selected. Choose a standard community or create a
            homebrew one.
          </p>
        ) : selection.mode === 'standard' ? (
          <StandardSelectionDetails selection={selection} />
        ) : (
          <HomebrewSelectionDetails selection={selection} />
        )}
      </div>

      <div className="bg-muted rounded-lg p-4">
        <h4 className="mb-2 text-sm font-medium">Debug: Selection State</h4>
        <pre className="text-muted-foreground overflow-auto text-xs">
          {JSON.stringify(selection, null, 2)}
        </pre>
      </div>
    </div>
  );
}
