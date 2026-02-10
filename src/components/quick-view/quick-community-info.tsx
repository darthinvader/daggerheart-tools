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
    case 'custom':
      return selection.custom?.name || 'Custom Community';
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
    case 'custom':
      return selection.custom?.feature || null;
  }
}

export function QuickCommunityInfo({
  selection,
  className,
}: QuickCommunityInfoProps) {
  const name = getCommunityName(selection);
  const feature = getCommunityFeature(selection);

  return (
    <div className={cn('quick-identity-card', className)}>
      <div className="quick-identity-header">
        <div className="quick-identity-icon-wrap community">
          <Home className="size-4" />
        </div>
        <div className="quick-identity-title">
          <span className="quick-identity-label">Community</span>
          <span className="quick-identity-name">{name}</span>
        </div>
      </div>
      {feature && (
        <div className="quick-identity-features max-h-96 overflow-y-auto">
          <ExpandableFeature feature={feature} />
        </div>
      )}
    </div>
  );
}
