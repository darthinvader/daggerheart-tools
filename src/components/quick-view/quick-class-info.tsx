import { Badge } from '@/components/ui/badge';
import { getClassByName, getSubclassByName } from '@/lib/data/classes';
import type {
  ClassSelection,
  ClassSubclassPair,
} from '@/lib/schemas/class-selection';
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
  sourceClass?: string;
}

function getFeaturesForClassPair(
  pair: ClassSubclassPair,
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
        sourceClass: pair.className,
      });
    });
    if (selection.homebrewClass.hopeFeature) {
      features.push({
        name: selection.homebrewClass.hopeFeature.name,
        description: selection.homebrewClass.hopeFeature.description,
        type: 'hope',
        sourceClass: pair.className,
      });
    }
    // Homebrew subclass features
    const subclass = selection.homebrewClass.subclasses.find(
      s => s.name === pair.subclassName
    );
    subclass?.features?.forEach(f => {
      features.push({
        name: f.name,
        description: f.description,
        type: 'subclass',
        sourceClass: pair.className,
      });
    });
  } else {
    // Standard class
    const gameClass = getClassByName(pair.className);
    const subclass = getSubclassByName(pair.className, pair.subclassName);

    gameClass?.classFeatures?.forEach(f => {
      features.push({
        name: f.name,
        description: f.description,
        type: 'class',
        sourceClass: pair.className,
      });
    });
    if (gameClass?.hopeFeature) {
      features.push({
        name: gameClass.hopeFeature.name,
        description: gameClass.hopeFeature.description,
        type: 'hope',
        sourceClass: pair.className,
      });
    }

    // Subclass features (only unlocked ones)
    const unlocked = unlockedSubclassFeatures?.[pair.subclassName] ?? [];
    subclass?.features?.forEach(f => {
      if (unlocked.includes(f.name)) {
        features.push({
          name: f.name,
          description: f.description,
          type: 'subclass',
          sourceClass: pair.className,
        });
      }
    });
  }

  return features;
}

function getClassFeatures(
  selection: ClassSelection,
  unlockedSubclassFeatures?: Record<string, string[]>
): FeatureInfo[] {
  // Handle multiclass: use the classes array if available
  const classPairs: ClassSubclassPair[] = selection.classes ?? [
    {
      className: selection.className,
      subclassName: selection.subclassName,
      spellcastTrait: selection.spellcastTrait,
    },
  ];

  const allFeatures: FeatureInfo[] = [];

  for (const pair of classPairs) {
    const features = getFeaturesForClassPair(
      pair,
      // For standard classes, we need to check each class individually
      selection.isHomebrew
        ? selection
        : {
            ...selection,
            className: pair.className,
            subclassName: pair.subclassName,
          },
      unlockedSubclassFeatures
    );
    allFeatures.push(...features);
  }

  return allFeatures;
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
  const isMulticlass =
    selection.isMulticlass && selection.classes && selection.classes.length > 1;

  // Get all class pairs for display
  const classPairs = selection.classes ?? [
    { className: selection.className, subclassName: selection.subclassName },
  ];

  return (
    <div className={cn('bg-card rounded-lg border p-3', className)}>
      {/* Class header - show all classes for multiclass */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {isMulticlass && (
          <Badge variant="secondary" className="text-xs">
            🔀 Multiclass
          </Badge>
        )}
        {classPairs.map(pair => {
          const colorClass = CLASS_COLORS[pair.className] ?? 'text-foreground';
          const emoji = CLASS_EMOJIS[pair.className] ?? '⚔️';
          return (
            <div key={pair.className} className="flex items-center gap-1">
              <span className="text-lg">{emoji}</span>
              <span className={cn('font-semibold', colorClass)}>
                {pair.className}
              </span>
              {pair.subclassName && (
                <span className="text-muted-foreground text-sm">
                  ({pair.subclassName})
                </span>
              )}
            </div>
          );
        })}
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
              key={`${f.sourceClass}-${f.name}-${i}`}
              feature={f}
              icon={
                f.type === 'hope' ? '✨' : f.type === 'subclass' ? '🔹' : '▸'
              }
              label={isMulticlass ? f.sourceClass : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
