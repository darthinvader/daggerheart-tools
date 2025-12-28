import {
  CharacteristicsIcon,
  DescriptionIcon,
  HeightIcon,
  LifespanIcon,
} from '@/components/shared';
import { Separator } from '@/components/ui/separator';
import type { Ancestry } from '@/lib/schemas/identity';

import { FeatureCard } from './feature-card';

interface AncestryDetailProps {
  ancestry: Ancestry;
}

export function AncestryDetail({ ancestry }: AncestryDetailProps) {
  return (
    <div className="bg-card space-y-4 rounded-lg border p-4">
      <div>
        <h2 className="mb-2 text-2xl font-bold">{ancestry.name}</h2>
        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1">
            <HeightIcon />
            <strong>Height:</strong> {ancestry.heightRange}
          </span>
          <span className="flex items-center gap-1">
            <LifespanIcon />
            <strong>Lifespan:</strong> {ancestry.lifespan}
          </span>
        </div>
      </div>

      <Separator className="my-2" />

      <div>
        <h3 className="mb-2 flex items-center gap-2 font-semibold">
          <DescriptionIcon />
          Description
        </h3>
        <p className="text-muted-foreground text-sm">{ancestry.description}</p>
      </div>

      <Separator className="my-2" />

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase">
          Features
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard feature={ancestry.primaryFeature} variant="primary" />
          <FeatureCard
            feature={ancestry.secondaryFeature}
            variant="secondary"
          />
        </div>
      </div>

      {ancestry.physicalCharacteristics.length > 0 && (
        <>
          <Separator className="my-2" />
          <div>
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <CharacteristicsIcon />
              Physical Characteristics
            </h3>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              {ancestry.physicalCharacteristics.map(char => (
                <li key={char}>{char}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
