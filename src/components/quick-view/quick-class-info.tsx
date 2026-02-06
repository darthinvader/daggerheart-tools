import { Badge } from '@/components/ui/badge';
import { getClassByName, getSubclassByName } from '@/lib/data/classes';
import {
  Blend,
  ChevronRight,
  ClassIcons,
  DomainIcons,
  Scroll,
  Sparkles,
  Square,
  Sword,
} from '@/lib/icons';
import type {
  ClassSelection,
  ClassSubclassPair,
} from '@/lib/schemas/class-selection';
import { CLASS_COLORS } from '@/lib/schemas/class-selection';
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
      <div className={cn('quick-identity-card', className)}>
        <div className="quick-identity-header">
          <div className="quick-identity-icon-wrap class">
            <Sword className="size-4" />
          </div>
          <div className="quick-identity-title">
            <span className="quick-identity-label">Class</span>
            <span className="text-muted-foreground text-sm">
              No class selected
            </span>
          </div>
        </div>
      </div>
    );
  }

  const features = getClassFeatures(selection, unlockedSubclassFeatures);
  const isMulticlass =
    selection.isMulticlass && selection.classes && selection.classes.length > 1;

  const classPairs = selection.classes ?? [
    { className: selection.className, subclassName: selection.subclassName },
  ];

  // Use first class for the icon
  const primaryClassName = classPairs[0]?.className ?? '';
  const PrimaryClassIcon = ClassIcons[primaryClassName] ?? Sword;
  const primaryColor = CLASS_COLORS[primaryClassName] ?? 'text-foreground';

  return (
    <div className={cn('quick-identity-card', className)}>
      {/* Header */}
      <div className="quick-identity-header">
        <div className={cn('quick-identity-icon-wrap class', primaryColor)}>
          <PrimaryClassIcon size={16} />
        </div>
        <div className="quick-identity-title">
          <span className="quick-identity-label">Class</span>
          <div className="flex flex-wrap items-center gap-1">
            {isMulticlass && (
              <Badge
                variant="secondary"
                className="flex items-center gap-0.5 text-[10px]"
              >
                <Blend className="size-2.5" /> Multiclass
              </Badge>
            )}
            {classPairs.map(pair => {
              const colorClass =
                CLASS_COLORS[pair.className] ?? 'text-foreground';
              return (
                <span
                  key={pair.className}
                  className="flex items-center gap-0.5"
                >
                  <span className={cn('text-sm font-semibold', colorClass)}>
                    {pair.className}
                  </span>
                  {pair.subclassName && (
                    <span className="text-muted-foreground text-[11px]">
                      ({pair.subclassName})
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Domains */}
      {selection.domains.length > 0 && (
        <div className="quick-class-domains">
          {selection.domains.map(domain => {
            const DomainIcon = DomainIcons[domain] ?? Scroll;
            return (
              <Badge
                key={domain}
                variant="outline"
                className="quick-domain-badge"
              >
                <DomainIcon size={10} className="inline-block" /> {domain}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div className="quick-identity-features">
          {features.map((f, i) => (
            <ExpandableFeature
              key={`${f.sourceClass}-${f.name}-${i}`}
              feature={f}
              icon={
                f.type === 'hope' ? (
                  <Sparkles className="size-2.5" />
                ) : f.type === 'subclass' ? (
                  <Square className="size-2.5" />
                ) : (
                  <ChevronRight className="size-2.5" />
                )
              }
              label={isMulticlass ? f.sourceClass : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
