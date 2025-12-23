import { Separator } from '@/components/ui/separator';
import type { Ancestry } from '@/lib/schemas/identity';

import {
  CharacteristicsIcon,
  DescriptionIcon,
  HeightIcon,
  LifespanIcon,
  PrimaryFeatureIcon,
  SecondaryFeatureIcon,
} from './ancestry-icons';

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
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
              <PrimaryFeatureIcon />
              Primary: {ancestry.primaryFeature.name}
            </h4>
            <p className="text-sm text-amber-900 dark:text-amber-200">
              {ancestry.primaryFeature.description}
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
            <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-400">
              <SecondaryFeatureIcon />
              Secondary: {ancestry.secondaryFeature.name}
            </h4>
            <p className="text-sm text-blue-900 dark:text-blue-200">
              {ancestry.secondaryFeature.description}
            </p>
          </div>
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
