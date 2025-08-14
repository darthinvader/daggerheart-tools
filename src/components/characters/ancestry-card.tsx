import { CardScaffold } from '@/components/characters/identity/card-scaffold';
import { FeatureBlock } from '@/components/characters/identity/feature-block';
import { HomebrewBadge } from '@/components/characters/identity/homebrew-badge';
import { Button } from '@/components/ui/button';
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
      actions={
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      }
    >
      {content}
    </CardScaffold>
  );
}
