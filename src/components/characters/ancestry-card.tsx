import { CardScaffold } from '@/components/characters/identity/card-scaffold';
import { FeatureBlock } from '@/components/characters/identity/feature-block';
import { HomebrewBadge } from '@/components/characters/identity/homebrew-badge';
// Title becomes tappable via CardScaffold consumers; no separate header action needed
import { ANCESTRIES } from '@/lib/data/characters/ancestries';

type AncestryDetails = {
  type?: 'standard' | 'mixed' | 'homebrew';
  mixed?: { name?: string; primaryFrom?: string; secondaryFrom?: string };
  homebrew?: {
    name: string;
    description?: string;
    heightRange?: string;
    lifespan?: string;
    physicalCharacteristics?: string[];
    primaryFeature: { name: string; description: string };
    secondaryFeature: { name: string; description: string };
  };
};

export function AncestryCard({
  ancestry,
  ancestryDetails,
  onEdit,
}: {
  ancestry: string;
  ancestryDetails?: AncestryDetails;
  onEdit: () => void;
}) {
  const isInteractive = (t: EventTarget | null) => {
    if (!(t instanceof HTMLElement)) return false;
    return !!t.closest(
      'button, a, input, textarea, select, [role="button"], [role="link"], [contenteditable="true"], [data-no-open]'
    );
  };
  const mode = ancestryDetails?.type ?? 'standard';

  const content = (() => {
    if (mode === 'homebrew' && ancestryDetails?.homebrew) {
      const hb = ancestryDetails.homebrew;
      return (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <span aria-hidden="true">🧬</span>
            <span>{hb.name}</span>
            <HomebrewBadge />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <FeatureBlock
              label="Primary"
              icon={'⭐'}
              name={hb.primaryFeature.name}
              description={hb.primaryFeature.description}
            />
            <FeatureBlock
              label="Secondary"
              icon={'✨'}
              name={hb.secondaryFeature.name}
              description={hb.secondaryFeature.description}
            />
          </div>
        </div>
      );
    }
    if (mode === 'mixed') {
      const mixedName = ancestryDetails?.mixed?.name?.trim();
      const pfName = ancestryDetails?.mixed?.primaryFrom ?? '';
      const sfName = ancestryDetails?.mixed?.secondaryFrom ?? '';
      const pf = ANCESTRIES.find(a => a.name === pfName);
      const sf = ANCESTRIES.find(a => a.name === sfName);
      return (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <span aria-hidden="true">🧬</span>
            <span>{mixedName || 'Mixed'}</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {pf ? (
              <FeatureBlock
                label="Primary"
                icon={'⭐'}
                name={pf.primaryFeature.name}
                description={`${pf.primaryFeature.description} (from ${pf.name})`}
              />
            ) : null}
            {sf ? (
              <FeatureBlock
                label="Secondary"
                icon={'✨'}
                name={sf.secondaryFeature.name}
                description={`${sf.secondaryFeature.description} (from ${sf.name})`}
              />
            ) : null}
          </div>
        </div>
      );
    }
    // standard
    const std = ANCESTRIES.find(a => a.name === ancestry);
    if (!std)
      return (
        <div className="text-muted-foreground text-sm">Select an ancestry…</div>
      );
    return (
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 font-semibold">
          <span aria-hidden="true">🧬</span>
          <span>{std.name}</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <FeatureBlock
            label="Primary"
            icon={'⭐'}
            name={std.primaryFeature.name}
            description={std.primaryFeature.description}
          />
          <FeatureBlock
            label="Secondary"
            icon={'✨'}
            name={std.secondaryFeature.name}
            description={std.secondaryFeature.description}
          />
        </div>
      </div>
    );
  })();

  return (
    <CardScaffold
      title="Ancestry"
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
