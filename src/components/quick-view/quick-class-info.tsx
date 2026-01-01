import { Badge } from '@/components/ui/badge';
import { getClassByName, getSubclassByName } from '@/lib/data/classes';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import { CLASS_COLORS, CLASS_EMOJIS } from '@/lib/schemas/class-selection';
import { DOMAIN_EMOJIS } from '@/lib/schemas/loadout';
import { cn } from '@/lib/utils';

import { ExpandableFeature } from './expandable-feature';

interface QuickClassInfoProps {
  selection: ClassSelection | null;
  unlockedSubclassFeatures?: Record<string, string[]>;
  className?: string;
}

interface FeatureInfo {
  name: string;
  description: string;
  type: 'class' | 'subclass' | 'hope';
}

function getClassFeatures(
  selection: ClassSelection,
  unlockedSubclassFeatures?: Record<string, string[]>
): FeatureInfo[] {
  const features: FeatureInfo[] = [];

  if (selection.isHomebrew && selection.homebrewClass) {
    // Homebrew class features
    selection.homebrewClass.classFeatures?.forEach(f => {
      features.push({
        name: f.name,
        description: f.description,
        type: 'class',
      });
    });
    if (selection.homebrewClass.hopeFeature) {
      features.push({
        name: selection.homebrewClass.hopeFeature.name,
        description: selection.homebrewClass.hopeFeature.description,
        type: 'hope',
      });
    }
    // Homebrew subclass features
    const subclass = selection.homebrewClass.subclasses.find(
      s => s.name === selection.subclassName
    );
    subclass?.features?.forEach(f => {
      features.push({
        name: f.name,
        description: f.description,
        type: 'subclass',
      });
    });
  } else {
    // Standard class
    const gameClass = getClassByName(selection.className);
    const subclass = getSubclassByName(
      selection.className,
      selection.subclassName
    );

    gameClass?.classFeatures?.forEach(f => {
      features.push({
        name: f.name,
        description: f.description,
        type: 'class',
      });
    });
    if (gameClass?.hopeFeature) {
      features.push({
        name: gameClass.hopeFeature.name,
        description: gameClass.hopeFeature.description,
        type: 'hope',
      });
    }

    // Subclass features (only unlocked ones)
    const unlocked = unlockedSubclassFeatures?.[selection.subclassName] ?? [];
    subclass?.features?.forEach(f => {
      if (unlocked.includes(f.name)) {
        features.push({
          name: f.name,
          description: f.description,
          type: 'subclass',
        });
      }
    });
  }

  return features;
}

export function QuickClassInfo({
  selection,
  unlockedSubclassFeatures,
  className,
}: QuickClassInfoProps) {
  if (!selection) {
    return (
      <div className={cn('bg-card rounded-lg border p-3', className)}>
        <div className="flex items-center gap-2">
          <span className="text-lg">⚔️</span>
          <span className="text-muted-foreground">No class selected</span>
        </div>
      </div>
    );
  }

  const features = getClassFeatures(selection, unlockedSubclassFeatures);
  const colorClass = CLASS_COLORS[selection.className] ?? 'text-foreground';
  const emoji = CLASS_EMOJIS[selection.className] ?? '⚔️';

  return (
    <div className={cn('bg-card rounded-lg border p-3', className)}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <span className={cn('font-semibold', colorClass)}>
          {selection.className}
        </span>
        {selection.subclassName && (
          <span className="text-muted-foreground text-sm">
            ({selection.subclassName})
          </span>
        )}
      </div>

      {/* Domains */}
      {selection.domains.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {selection.domains.map(domain => (
            <Badge
              key={domain}
              variant="outline"
              className="px-2 py-0.5 text-xs"
            >
              {DOMAIN_EMOJIS[domain] ?? '📖'} {domain}
            </Badge>
          ))}
        </div>
      )}

      {/* Features list */}
      {features.length > 0 && (
        <div className="space-y-1 text-sm">
          {features.map((f, i) => (
            <ExpandableFeature
              key={i}
              feature={f}
              icon={
                f.type === 'hope' ? '✨' : f.type === 'subclass' ? '🔹' : '▸'
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
