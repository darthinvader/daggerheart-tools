import { ALL_CLASSES } from '@/lib/data/classes';
import type {
  BaseClass,
  BaseFeature,
  BaseSubclass,
  CharacterTier,
  SubclassFeature,
} from '@/lib/schemas/core';

export type FeatureSource = 'class' | 'subclass' | 'custom';

export type FeatureView = {
  name: string;
  description: string;
  type?: string;
  tags?: string[];
  level: number; // gate level (minLevel or explicit level)
  tier?: CharacterTier;
  unlockCondition?: string;
  source: FeatureSource;
};

export function getClassByName(name: string): BaseClass | undefined {
  return (ALL_CLASSES as unknown as BaseClass[]).find(c => c.name === name);
}

export function getSubclassByName(
  cls: BaseClass | undefined,
  subclassName: string
): BaseSubclass | undefined {
  const list = (cls as unknown as { subclasses?: BaseSubclass[] })?.subclasses;
  return list?.find(s => s.name === subclassName);
}

function gateLevelFromFeature(f: BaseFeature | SubclassFeature): number {
  // Prefer explicit level when present, otherwise use availability.minLevel, default 1
  const explicit = (f as SubclassFeature).level;
  if (typeof explicit === 'number') return explicit;
  const min = f.availability?.minLevel;
  return typeof min === 'number' ? min : 1;
}

function tierFromFeature(
  f: BaseFeature | SubclassFeature
): CharacterTier | undefined {
  const t = f.availability?.tier as CharacterTier | undefined;
  if (t) return t;
  // Fallback by level when schema omits tier: 1 -> '1', 2-4 -> '2-4', 5-7 -> '5-7', 8-10 -> '8-10'
  const lvl = gateLevelFromFeature(f);
  if (lvl <= 1) return '1';
  if (lvl >= 2 && lvl <= 4) return '2-4';
  if (lvl >= 5 && lvl <= 7) return '5-7';
  return '8-10';
}

export function deriveFeatureUnlocks(
  className: string,
  subclassName: string
): FeatureView[] {
  const cls = getClassByName(className);
  if (!cls) return [];
  const sub = getSubclassByName(cls, subclassName);
  const classFeatures = (cls.classFeatures ?? []) as BaseFeature[];
  const subclassFeatures = (sub?.features ?? []) as SubclassFeature[];
  const mapped: FeatureView[] = [
    ...classFeatures.map(f => ({
      name: f.name,
      description: f.description,
      type: f.type as string | undefined,
      tags: f.tags,
      level: gateLevelFromFeature(f),
      tier: tierFromFeature(f),
      unlockCondition: f.availability?.unlockCondition as string | undefined,
      source: 'class' as const,
    })),
    ...subclassFeatures.map(f => ({
      name: f.name,
      description: f.description,
      type: f.type as string | undefined,
      tags: f.tags,
      level: gateLevelFromFeature(f),
      tier: tierFromFeature(f),
      unlockCondition: f.availability?.unlockCondition as string | undefined,
      source: 'subclass' as const,
    })),
  ];
  // Stabilize ordering by level then name
  return mapped.sort(
    (a, b) => a.level - b.level || a.name.localeCompare(b.name)
  );
}

export function getUnlockedFeatures(
  features: FeatureView[],
  currentLevel: number
) {
  const current = features.filter(f => f.level <= currentLevel);
  const future = features.filter(f => f.level > currentLevel);
  return { current, future } as const;
}
