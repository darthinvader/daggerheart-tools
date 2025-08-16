// No header edit icon; title becomes tappable

import { CardScaffold } from '@/components/characters/identity/card-scaffold';
import { FeatureBlock } from '@/components/characters/identity/feature-block';
import { HomebrewBadge } from '@/components/characters/identity/homebrew-badge';
import { TraitChips } from '@/components/characters/identity/trait-chips';
import type { CommunityDetails } from '@/components/characters/identity/types';
import { normalizeCommunity } from '@/features/characters/logic/identity';

export function CommunityCard({
  community,
  communityDetails,
  onEdit,
}: {
  community: string;
  communityDetails?: CommunityDetails;
  onEdit: () => void;
}) {
  const normalized = normalizeCommunity({
    community,
    details: communityDetails,
  });

  const content = (() => {
    if (normalized.mode === 'empty') {
      return (
        <div className="text-muted-foreground text-sm">Select a community…</div>
      );
    }
    const isHomebrew = normalized.mode === 'homebrew';
    const feature = normalized.feature;
    return (
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 font-semibold">
          <span aria-hidden="true">🏘️</span>
          <span>{normalized.name}</span>
          {isHomebrew ? <HomebrewBadge /> : null}
        </div>
        <TraitChips traits={normalized.traits} />
        {feature ? (
          <FeatureBlock
            icon={'✨'}
            name={feature.name}
            description={feature.description}
          />
        ) : null}
      </div>
    );
  })();

  return (
    <CardScaffold
      title="Community"
      subtitle="Tap the title to edit"
      onTitleClick={onEdit}
      actions={null}
    >
      {content}
    </CardScaffold>
  );
}
