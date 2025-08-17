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
  const isInteractive = (t: EventTarget | null) => {
    if (!(t instanceof HTMLElement)) return false;
    return !!t.closest(
      'button, a, input, textarea, select, [role="button"], [role="link"], [contenteditable="true"], [data-no-open]'
    );
  };
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
        {/* Trait chips (compact) */}
        <TraitChips traits={normalized.traits} prefix="🏷️" />
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
      subtitle="Tap title or section to edit"
      titleClassName="text-lg sm:text-xl"
      onTitleClick={onEdit}
      actions={null}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={e => {
          if (isInteractive(e.target)) return;
          onEdit();
        }}
        onKeyDown={e => {
          if (isInteractive(e.target)) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEdit();
          }
        }}
        className="hover:bg-accent/30 focus-visible:ring-ring cursor-pointer rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {content}
      </div>
    </CardScaffold>
  );
}
