import { useMemo, useState } from 'react';

import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Ancestry, AncestryFeature } from '@/lib/schemas/identity';
import { ANCESTRIES } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import { PrimaryFeatureIcon, SecondaryFeatureIcon } from './ancestry-icons';
import { AncestrySearch } from './ancestry-search';
import { FeatureDisplay } from './feature-display';

interface FeaturePickerProps {
  label: string;
  selectedAncestry: string | null;
  selectedFeature: AncestryFeature | null;
  featureType: 'primary' | 'secondary';
  onSelect: (ancestry: Ancestry) => void;
}

export function FeaturePicker({
  label,
  selectedAncestry,
  selectedFeature,
  featureType,
  onSelect,
}: FeaturePickerProps) {
  const [search, setSearch] = useState('');

  const filteredAncestries = useMemo(() => {
    if (!search.trim()) return ANCESTRIES;
    const term = search.toLowerCase();
    return ANCESTRIES.filter(
      ancestry =>
        ancestry.name.toLowerCase().includes(term) ||
        (featureType === 'primary'
          ? ancestry.primaryFeature.name.toLowerCase().includes(term)
          : ancestry.secondaryFeature.name.toLowerCase().includes(term))
    );
  }, [search, featureType]);

  const isPrimary = featureType === 'primary';

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        {isPrimary ? <PrimaryFeatureIcon /> : <SecondaryFeatureIcon />}
        {label}
      </Label>

      <AncestrySearch
        value={search}
        onChange={setSearch}
        placeholder={`Search for ${featureType} feature...`}
      />

      <ScrollArea className="h-72">
        <div className="space-y-1 pr-4">
          {filteredAncestries.map(ancestry => {
            const feature = isPrimary
              ? ancestry.primaryFeature
              : ancestry.secondaryFeature;
            const isSelected = selectedAncestry === ancestry.name;

            return (
              <button
                key={ancestry.name}
                type="button"
                onClick={() => onSelect(ancestry)}
                className={cn(
                  'w-full rounded-lg border p-3 text-left transition-all',
                  'hover:border-primary/50 hover:bg-accent/50',
                  'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                  isSelected
                    ? isPrimary
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-border bg-card'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-medium">{feature.name}</span>
                    <span className="text-muted-foreground ml-2 text-sm">
                      from {ancestry.name}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {feature.description}
                </p>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {selectedFeature && (
        <FeatureDisplay feature={selectedFeature} variant={featureType} />
      )}
    </div>
  );
}
