import { Home } from '@/lib/icons';
import type { CommunitySelection } from '@/lib/schemas/identity';
import { cn } from '@/lib/utils';

import { ExpandableFeature } from './expandable-feature';

interface QuickCommunityInfoProps {
  selection: CommunitySelection;
  className?: string;
}

function getCommunityName(selection: CommunitySelection): string {
  if (!selection) return 'None';
  switch (selection.mode) {
    case 'standard':
      return selection.community.name;
    case 'homebrew':
      return selection.homebrew.name;
  }
}

function getCommunityFeature(
  selection: CommunitySelection
): { name: string; description: string } | null {
  if (!selection) return null;
  switch (selection.mode) {
    case 'standard':
      return selection.community.feature;
    case 'homebrew':
      return selection.homebrew.feature;
  }
}

export function QuickCommunityInfo({
  selection,
  className,
}: QuickCommunityInfoProps) {
  const name = getCommunityName(selection);
  const feature = getCommunityFeature(selection);

  return (
    <div className={cn('bg-card rounded-lg border p-3', className)}>
      <div className="mb-2 flex items-center gap-2">
        <Home className="size-5" />
        <span className="font-semibold">{name}</span>
      </div>
      {feature && <ExpandableFeature feature={feature} />}
    </div>
  );
}
