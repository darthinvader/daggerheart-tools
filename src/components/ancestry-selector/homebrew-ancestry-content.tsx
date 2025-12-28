import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Ancestry } from '@/lib/schemas/identity';

import { FeatureCard } from './feature-card';

function AncestryPhysicalStats({
  heightRange,
  lifespan,
}: {
  heightRange?: string;
  lifespan?: string;
}) {
  if (!heightRange && !lifespan) return null;
  return (
    <div className="flex flex-wrap gap-3 text-sm">
      {heightRange && (
        <span className="bg-muted flex items-center gap-1 rounded-full px-3 py-1">
          📏 {heightRange}
        </span>
      )}
      {lifespan && (
        <span className="bg-muted flex items-center gap-1 rounded-full px-3 py-1">
          ⏳ {lifespan}
        </span>
      )}
    </div>
  );
}

function AncestryFeatures({
  primaryFeature,
  secondaryFeature,
}: {
  primaryFeature?: Ancestry['primaryFeature'];
  secondaryFeature?: Ancestry['secondaryFeature'];
}) {
  if (!primaryFeature?.name && !secondaryFeature?.name) return null;
  return (
    <>
      <Separator />
      <div>
        <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          ⚔️ Ancestry Features
        </h5>
        <div className="grid gap-3 md:grid-cols-2">
          {primaryFeature?.name && (
            <FeatureCard feature={primaryFeature} variant="primary" />
          )}
          {secondaryFeature?.name && (
            <FeatureCard feature={secondaryFeature} variant="secondary" />
          )}
        </div>
      </div>
    </>
  );
}

function PhysicalCharacteristics({
  characteristics,
}: {
  characteristics?: string[];
}) {
  if (!characteristics?.length) return null;
  return (
    <>
      <Separator />
      <div>
        <h5 className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
          🎭 Physical Characteristics
        </h5>
        <div className="flex flex-wrap gap-2">
          {characteristics.map(char => (
            <Badge key={char} variant="outline" className="text-xs">
              {char}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}

export function HomebrewAncestryContent({ ancestry }: { ancestry: Ancestry }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text-xl font-bold">
          {ancestry.name || '(Unnamed Homebrew)'}
        </h4>
        <Badge
          variant="secondary"
          className="gap-1 border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300"
        >
          🛠️ Homebrew
        </Badge>
      </div>

      <AncestryPhysicalStats
        heightRange={ancestry.heightRange}
        lifespan={ancestry.lifespan}
      />

      {ancestry.description && (
        <>
          <Separator />
          <p className="text-muted-foreground text-sm leading-relaxed">
            {ancestry.description}
          </p>
        </>
      )}

      <AncestryFeatures
        primaryFeature={ancestry.primaryFeature}
        secondaryFeature={ancestry.secondaryFeature}
      />

      <PhysicalCharacteristics
        characteristics={ancestry.physicalCharacteristics}
      />
    </div>
  );
}
