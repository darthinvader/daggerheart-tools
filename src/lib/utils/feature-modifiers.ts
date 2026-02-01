import { getClassByName, getSubclassByName } from '@/lib/data/classes';
import { getCardByName } from '@/lib/data/domains';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { FeatureStatModifiers } from '@/lib/schemas/core';
import type { InventoryState } from '@/lib/schemas/equipment';
import type {
  AncestrySelection,
  CommunitySelection,
} from '@/lib/schemas/identity';
import type { LoadoutSelection } from '@/lib/schemas/loadout';

export type ModifierTraits = Record<
  'Agility' | 'Strength' | 'Finesse' | 'Instinct' | 'Presence' | 'Knowledge',
  number
>;

export interface AggregatedModifiers {
  evasion: number;
  proficiency: number;
  armorScore: number;
  majorThreshold: number;
  severeThreshold: number;
  attackRolls: number;
  spellcastRolls: number;
  traits: ModifierTraits;
}

export interface BonusSourceEntry {
  type:
    | 'class-feature'
    | 'subclass-feature'
    | 'ancestry-feature'
    | 'community-feature'
    | 'domain-card'
    | 'inventory-item'
    | 'inventory-feature'
    | 'equipment-item'
    | 'equipment-feature'
    | 'experience-bonus';
  sourceName: string;
  detail?: string;
  modifiers: FeatureStatModifiers;
  experienceBonus?: { experience: string; bonus: number };
}

export interface BonusBreakdown {
  total: AggregatedModifiers;
  sources: BonusSourceEntry[];
}

export const EMPTY_MODIFIERS: AggregatedModifiers = {
  evasion: 0,
  proficiency: 0,
  armorScore: 0,
  majorThreshold: 0,
  severeThreshold: 0,
  attackRolls: 0,
  spellcastRolls: 0,
  traits: {
    Agility: 0,
    Strength: 0,
    Finesse: 0,
    Instinct: 0,
    Presence: 0,
    Knowledge: 0,
  },
};

const TRAITS: Array<keyof ModifierTraits> = [
  'Agility',
  'Strength',
  'Finesse',
  'Instinct',
  'Presence',
  'Knowledge',
];

function addTraitModifiers(
  target: ModifierTraits,
  traits?: Partial<ModifierTraits> | null
) {
  if (!traits) return;
  for (const trait of TRAITS) {
    const value = traits[trait];
    if (typeof value === 'number') {
      target[trait] += value;
    }
  }
}

function addFeatureModifiers(
  target: AggregatedModifiers,
  modifiers?: FeatureStatModifiers
) {
  if (!modifiers) return;
  if (typeof modifiers.evasion === 'number')
    target.evasion += modifiers.evasion;
  if (typeof modifiers.proficiency === 'number')
    target.proficiency += modifiers.proficiency;
  if (typeof modifiers.armorScore === 'number')
    target.armorScore += modifiers.armorScore;
  if (typeof modifiers.majorThreshold === 'number')
    target.majorThreshold += modifiers.majorThreshold;
  if (typeof modifiers.severeThreshold === 'number')
    target.severeThreshold += modifiers.severeThreshold;
  if (typeof modifiers.attackRolls === 'number')
    target.attackRolls += modifiers.attackRolls;
  if (typeof modifiers.spellcastRolls === 'number')
    target.spellcastRolls += modifiers.spellcastRolls;
  if (modifiers.traits) addTraitModifiers(target.traits, modifiers.traits);
}

export function combineModifiers(
  base: AggregatedModifiers,
  extra: AggregatedModifiers
): AggregatedModifiers {
  return {
    evasion: base.evasion + extra.evasion,
    proficiency: base.proficiency + extra.proficiency,
    armorScore: base.armorScore + extra.armorScore,
    majorThreshold: base.majorThreshold + extra.majorThreshold,
    severeThreshold: base.severeThreshold + extra.severeThreshold,
    attackRolls: base.attackRolls + extra.attackRolls,
    spellcastRolls: base.spellcastRolls + extra.spellcastRolls,
    traits: {
      Agility: base.traits.Agility + extra.traits.Agility,
      Strength: base.traits.Strength + extra.traits.Strength,
      Finesse: base.traits.Finesse + extra.traits.Finesse,
      Instinct: base.traits.Instinct + extra.traits.Instinct,
      Presence: base.traits.Presence + extra.traits.Presence,
      Knowledge: base.traits.Knowledge + extra.traits.Knowledge,
    },
  };
}

export function aggregateBonusModifiers(params: {
  classSelection: ClassSelection | null | undefined;
  ancestry: AncestrySelection | null | undefined;
  community: CommunitySelection | null | undefined;
  loadout: LoadoutSelection | null | undefined;
  inventory: InventoryState | null | undefined;
  isWearingArmor?: boolean;
  proficiency?: number;
  level?: number;
  traitScores?: Partial<ModifierTraits>;
}): AggregatedModifiers {
  return aggregateBonusBreakdown(params).total;
}

export function aggregateBonusBreakdown(params: {
  classSelection: ClassSelection | null | undefined;
  ancestry: AncestrySelection | null | undefined;
  community: CommunitySelection | null | undefined;
  loadout: LoadoutSelection | null | undefined;
  inventory: InventoryState | null | undefined;
  isWearingArmor?: boolean;
  proficiency?: number;
  level?: number;
  traitScores?: Partial<ModifierTraits>;
}): BonusBreakdown {
  const totals: AggregatedModifiers = {
    ...EMPTY_MODIFIERS,
    traits: { ...EMPTY_MODIFIERS.traits },
  };

  const sources: BonusSourceEntry[] = [];

  const pushSource = (
    entry: Omit<BonusSourceEntry, 'modifiers'> & {
      modifiers?: FeatureStatModifiers;
    }
  ) => {
    if (!entry.modifiers) return;
    sources.push({
      type: entry.type,
      sourceName: entry.sourceName,
      detail: entry.detail,
      modifiers: entry.modifiers,
    });
    addFeatureModifiers(totals, entry.modifiers);
  };

  const modifierContext = {
    proficiency: params.proficiency,
    level: params.level,
    traitScores: params.traitScores,
  };

  collectClassSources(params, modifierContext, pushSource);
  collectSubclassSources(params, modifierContext, pushSource);
  collectAncestrySources(params.ancestry, modifierContext, pushSource);
  collectCommunitySources(params.community, modifierContext, pushSource);
  collectLoadoutSources(
    params.loadout,
    params.isWearingArmor,
    modifierContext,
    pushSource
  );
  collectInventorySources(params.inventory, modifierContext, pushSource);

  return { total: totals, sources };
}

type ModifierContext = {
  proficiency?: number;
  level?: number;
  traitScores?: Partial<ModifierTraits>;
};

type ScaledModifiersMetadata = {
  per: 'proficiency' | 'level' | 'trait';
  modifiers: FeatureStatModifiers;
  trait?: keyof ModifierTraits;
  factor?: number;
  round?: 'floor' | 'ceil' | 'round';
};

function resolveModifiers(
  feature: unknown,
  context: ModifierContext
): FeatureStatModifiers | undefined {
  const base = (feature as { modifiers?: FeatureStatModifiers })?.modifiers;
  const scaled = resolveScaledModifiers(feature, context);
  return mergeFeatureModifiers(base, scaled);
}

function resolveScaledModifiers(
  feature: unknown,
  context: ModifierContext
): FeatureStatModifiers | undefined {
  const metadata = (feature as { metadata?: Record<string, unknown> })
    ?.metadata;
  const scaled = metadata?.scaledModifiers as
    | ScaledModifiersMetadata
    | undefined;
  if (!scaled || typeof scaled !== 'object') return undefined;
  if (!scaled.modifiers) return undefined;

  const multiplier = resolveScaledMultiplier(scaled, context);
  if (multiplier === 0) return undefined;
  return scaleFeatureModifiers(scaled.modifiers, multiplier);
}

function resolveScaledMultiplier(
  scaled: ScaledModifiersMetadata,
  context: ModifierContext
) {
  if (scaled.per === 'proficiency') {
    return Math.max(0, Math.floor(context.proficiency ?? 0));
  }
  if (scaled.per === 'level') {
    return Math.max(0, Math.floor(context.level ?? 0));
  }
  const trait = scaled.trait;
  if (!trait) return 0;
  const traitScore = context.traitScores?.[trait];
  if (typeof traitScore !== 'number') return 0;
  const factor = typeof scaled.factor === 'number' ? scaled.factor : 1;
  const scaledValue = traitScore * factor;
  const round = scaled.round ?? 'floor';
  if (round === 'ceil') return Math.max(0, Math.ceil(scaledValue));
  if (round === 'round') return Math.max(0, Math.round(scaledValue));
  return Math.max(0, Math.floor(scaledValue));
}

function mergeFeatureModifiers(
  base?: FeatureStatModifiers,
  extra?: FeatureStatModifiers
): FeatureStatModifiers | undefined {
  if (!base && !extra) return undefined;
  if (!base) return extra;
  if (!extra) return base;
  return {
    evasion: sumOptional(base.evasion, extra.evasion),
    proficiency: sumOptional(base.proficiency, extra.proficiency),
    armorScore: sumOptional(base.armorScore, extra.armorScore),
    majorThreshold: sumOptional(base.majorThreshold, extra.majorThreshold),
    severeThreshold: sumOptional(base.severeThreshold, extra.severeThreshold),
    attackRolls: sumOptional(base.attackRolls, extra.attackRolls),
    spellcastRolls: sumOptional(base.spellcastRolls, extra.spellcastRolls),
    traits: mergeTraitModifiers(base.traits, extra.traits),
  };
}

function mergeTraitModifiers(
  base?: FeatureStatModifiers['traits'],
  extra?: FeatureStatModifiers['traits']
): FeatureStatModifiers['traits'] | undefined {
  if (!base && !extra) return undefined;
  return {
    Agility: sumOptional(base?.Agility, extra?.Agility),
    Strength: sumOptional(base?.Strength, extra?.Strength),
    Finesse: sumOptional(base?.Finesse, extra?.Finesse),
    Instinct: sumOptional(base?.Instinct, extra?.Instinct),
    Presence: sumOptional(base?.Presence, extra?.Presence),
    Knowledge: sumOptional(base?.Knowledge, extra?.Knowledge),
  };
}

function sumOptional(a?: number, b?: number) {
  if (typeof a !== 'number' && typeof b !== 'number') return undefined;
  return (a ?? 0) + (b ?? 0);
}

function scaleFeatureModifiers(
  modifiers: FeatureStatModifiers,
  multiplier: number
): FeatureStatModifiers {
  const traits = modifiers.traits
    ? {
        Agility:
          typeof modifiers.traits.Agility === 'number'
            ? modifiers.traits.Agility * multiplier
            : undefined,
        Strength:
          typeof modifiers.traits.Strength === 'number'
            ? modifiers.traits.Strength * multiplier
            : undefined,
        Finesse:
          typeof modifiers.traits.Finesse === 'number'
            ? modifiers.traits.Finesse * multiplier
            : undefined,
        Instinct:
          typeof modifiers.traits.Instinct === 'number'
            ? modifiers.traits.Instinct * multiplier
            : undefined,
        Presence:
          typeof modifiers.traits.Presence === 'number'
            ? modifiers.traits.Presence * multiplier
            : undefined,
        Knowledge:
          typeof modifiers.traits.Knowledge === 'number'
            ? modifiers.traits.Knowledge * multiplier
            : undefined,
      }
    : undefined;

  return {
    evasion:
      typeof modifiers.evasion === 'number'
        ? modifiers.evasion * multiplier
        : undefined,
    proficiency:
      typeof modifiers.proficiency === 'number'
        ? modifiers.proficiency * multiplier
        : undefined,
    armorScore:
      typeof modifiers.armorScore === 'number'
        ? modifiers.armorScore * multiplier
        : undefined,
    majorThreshold:
      typeof modifiers.majorThreshold === 'number'
        ? modifiers.majorThreshold * multiplier
        : undefined,
    severeThreshold:
      typeof modifiers.severeThreshold === 'number'
        ? modifiers.severeThreshold * multiplier
        : undefined,
    attackRolls:
      typeof modifiers.attackRolls === 'number'
        ? modifiers.attackRolls * multiplier
        : undefined,
    spellcastRolls:
      typeof modifiers.spellcastRolls === 'number'
        ? modifiers.spellcastRolls * multiplier
        : undefined,
    traits,
  };
}

function collectClassSources(
  params: {
    classSelection: ClassSelection | null | undefined;
  },
  context: ModifierContext,
  pushSource: (
    entry: Omit<BonusSourceEntry, 'modifiers'> & {
      modifiers?: FeatureStatModifiers;
    }
  ) => void
) {
  const className = params.classSelection?.className;
  const homebrewClass = params.classSelection?.homebrewClass;

  if (params.classSelection?.isHomebrew && homebrewClass) {
    for (const feature of homebrewClass.classFeatures ?? []) {
      pushSource({
        type: 'class-feature',
        sourceName: homebrewClass.name ?? className ?? 'Homebrew Class',
        detail: feature.name,
        modifiers: resolveModifiers(feature, context),
      });
    }
    return;
  }

  if (!className) return;
  const gameClass = getClassByName(className);
  if (!gameClass) return;
  for (const feature of gameClass.classFeatures ?? []) {
    pushSource({
      type: 'class-feature',
      sourceName: className,
      detail: feature.name,
      modifiers: resolveModifiers(feature, context),
    });
  }
}

function collectSubclassSources(
  params: {
    classSelection: ClassSelection | null | undefined;
  },
  context: ModifierContext,
  pushSource: (
    entry: Omit<BonusSourceEntry, 'modifiers'> & {
      modifiers?: FeatureStatModifiers;
    }
  ) => void
) {
  const className = params.classSelection?.className;
  const subclassName = params.classSelection?.subclassName;
  const homebrewClass = params.classSelection?.homebrewClass;
  if (!className || !subclassName) return;

  if (params.classSelection?.isHomebrew && homebrewClass) {
    collectHomebrewSubclassSources(
      homebrewClass,
      subclassName,
      context,
      pushSource
    );
    return;
  }

  collectStandardSubclassSources(className, subclassName, context, pushSource);
}

function collectHomebrewSubclassSources(
  homebrewClass: NonNullable<ClassSelection['homebrewClass']>,
  subclassName: string,
  context: ModifierContext,
  pushSource: (
    entry: Omit<BonusSourceEntry, 'modifiers'> & {
      modifiers?: FeatureStatModifiers;
    }
  ) => void
) {
  const homebrewSubclass = homebrewClass.subclasses?.find(
    subclass => subclass.name === subclassName
  );
  if (!homebrewSubclass) return;
  for (const feature of homebrewSubclass.features ?? []) {
    pushSource({
      type: 'subclass-feature',
      sourceName: subclassName,
      detail: feature.name,
      modifiers: resolveModifiers(feature, context),
    });
  }
}

function collectStandardSubclassSources(
  className: string,
  subclassName: string,
  context: ModifierContext,
  pushSource: (
    entry: Omit<BonusSourceEntry, 'modifiers'> & {
      modifiers?: FeatureStatModifiers;
    }
  ) => void
) {
  const subclass = getSubclassByName(className, subclassName);
  if (!subclass) return;
  for (const feature of subclass.features ?? []) {
    pushSource({
      type: 'subclass-feature',
      sourceName: subclassName,
      detail: feature.name,
      modifiers: resolveModifiers(feature, context),
    });
  }
}

function collectAncestrySources(
  ancestry: AncestrySelection | null | undefined,
  context: ModifierContext,
  pushSource: (
    entry: Omit<BonusSourceEntry, 'modifiers'> & {
      modifiers?: FeatureStatModifiers;
    }
  ) => void
) {
  if (!ancestry) return;
  if (ancestry.mode === 'standard' && ancestry.ancestry) {
    pushSource({
      type: 'ancestry-feature',
      sourceName: ancestry.ancestry.name,
      detail: ancestry.ancestry.primaryFeature.name,
      modifiers: resolveModifiers(ancestry.ancestry.primaryFeature, context),
    });
    pushSource({
      type: 'ancestry-feature',
      sourceName: ancestry.ancestry.name,
      detail: ancestry.ancestry.secondaryFeature.name,
      modifiers: resolveModifiers(ancestry.ancestry.secondaryFeature, context),
    });
  }
  if (ancestry.mode === 'mixed' && ancestry.mixedAncestry) {
    pushSource({
      type: 'ancestry-feature',
      sourceName: ancestry.mixedAncestry.name,
      detail: ancestry.mixedAncestry.primaryFeature.name,
      modifiers: resolveModifiers(
        ancestry.mixedAncestry.primaryFeature,
        context
      ),
    });
    pushSource({
      type: 'ancestry-feature',
      sourceName: ancestry.mixedAncestry.name,
      detail: ancestry.mixedAncestry.secondaryFeature.name,
      modifiers: resolveModifiers(
        ancestry.mixedAncestry.secondaryFeature,
        context
      ),
    });
  }
  if (ancestry.mode === 'homebrew' && ancestry.homebrew) {
    pushSource({
      type: 'ancestry-feature',
      sourceName: ancestry.homebrew.name,
      detail: ancestry.homebrew.primaryFeature.name,
      modifiers: resolveModifiers(ancestry.homebrew.primaryFeature, context),
    });
    pushSource({
      type: 'ancestry-feature',
      sourceName: ancestry.homebrew.name,
      detail: ancestry.homebrew.secondaryFeature.name,
      modifiers: resolveModifiers(ancestry.homebrew.secondaryFeature, context),
    });
  }
}

function collectCommunitySources(
  community: CommunitySelection | null | undefined,
  context: ModifierContext,
  pushSource: (
    entry: Omit<BonusSourceEntry, 'modifiers'> & {
      modifiers?: FeatureStatModifiers;
    }
  ) => void
) {
  if (!community) return;
  if (community.mode === 'standard' && community.community) {
    pushSource({
      type: 'community-feature',
      sourceName: community.community.name,
      detail: community.community.feature.name,
      modifiers: resolveModifiers(community.community.feature, context),
    });
  }
  if (community.mode === 'homebrew' && community.homebrew) {
    pushSource({
      type: 'community-feature',
      sourceName: community.homebrew.name,
      detail: community.homebrew.feature.name,
      modifiers: resolveModifiers(community.homebrew.feature, context),
    });
  }
}

type DomainRequirement = {
  domain?: string;
  minCards?: number;
};

function resolveDomainRequirement(
  metadata?: Record<string, unknown>
): DomainRequirement | null {
  if (!metadata) return null;
  const rawRequirement = metadata.domainRequirement;
  if (!rawRequirement || typeof rawRequirement !== 'object') return null;
  const requirement = rawRequirement as {
    domain?: unknown;
    minCards?: unknown;
  };
  const domain =
    typeof requirement.domain === 'string' ? requirement.domain : undefined;
  const minCards =
    typeof requirement.minCards === 'number' ? requirement.minCards : undefined;
  if (!domain && typeof minCards !== 'number') return null;
  return { domain, minCards };
}

function requiresArmor(metadata?: Record<string, unknown>) {
  return metadata?.requiresArmor === true;
}

function countDomainCards(cards: Array<{ domain?: string }>) {
  const counts: Record<string, number> = {};
  for (const card of cards) {
    if (!card.domain) continue;
    counts[card.domain] = (counts[card.domain] ?? 0) + 1;
  }
  return counts;
}

function meetsDomainRequirement(
  card: { domain?: string; metadata?: Record<string, unknown> },
  domainCounts: Record<string, number>,
  isWearingArmor?: boolean
) {
  if (requiresArmor(card.metadata) && !isWearingArmor) return false;
  const requirement = resolveDomainRequirement(card.metadata);
  if (!requirement) return true;
  const domain = requirement.domain ?? card.domain;
  if (!domain) return false;
  const minCards =
    typeof requirement.minCards === 'number' ? requirement.minCards : 0;
  return (domainCounts[domain] ?? 0) >= minCards;
}

function mergeMetadata(
  base?: Record<string, unknown>,
  override?: Record<string, unknown>
): Record<string, unknown> | undefined {
  if (!base && !override) return undefined;
  const merged = { ...(base ?? {}), ...(override ?? {}) };
  return Object.keys(merged).length > 0 ? merged : undefined;
}

function resolveLoadoutCard(card: LoadoutSelection['activeCards'][number]) {
  const canonical = getCardByName(card.name);
  if (!canonical) return card;
  const metadata = mergeMetadata(
    canonical.metadata as Record<string, unknown> | undefined,
    card.metadata
  );
  return {
    ...canonical,
    ...card,
    modifiers: card.modifiers ?? canonical.modifiers,
    metadata,
  };
}

function collectLoadoutSources(
  loadout: LoadoutSelection | null | undefined,
  isWearingArmor: boolean | undefined,
  context: ModifierContext,
  pushSource: (
    entry: Omit<BonusSourceEntry, 'modifiers'> & {
      modifiers?: FeatureStatModifiers;
    }
  ) => void
) {
  if (!loadout) return;
  const activeCards = loadout.activeCards ?? [];
  const domainCounts = countDomainCards(activeCards);

  for (const card of activeCards) {
    if (card.isActivated === false) continue;
    const resolvedCard = resolveLoadoutCard(card);
    if (!meetsDomainRequirement(resolvedCard, domainCounts, isWearingArmor)) {
      continue;
    }
    pushSource({
      type: 'domain-card',
      sourceName: resolvedCard.name,
      detail: resolvedCard.domain,
      modifiers: resolveModifiers(resolvedCard, context),
    });
  }
}

function collectInventorySources(
  inventory: InventoryState | null | undefined,
  context: ModifierContext,
  pushSource: (
    entry: Omit<BonusSourceEntry, 'modifiers'> & {
      modifiers?: FeatureStatModifiers;
    }
  ) => void
) {
  if (!inventory) return;
  for (const entry of inventory.items ?? []) {
    if (!entry.isEquipped) continue;
    const itemName = entry.item?.name ?? 'Equipped Item';
    pushInventoryTraitBonus(entry, itemName, pushSource);
    pushSource({
      type: 'inventory-item',
      sourceName: itemName,
      modifiers: entry.item?.statModifiers,
    });
    pushInventoryFeatureSources(entry, itemName, context, pushSource);
  }
}

function pushInventoryTraitBonus(
  entry: InventoryState['items'][number],
  itemName: string,
  pushSource: (
    entry: Omit<BonusSourceEntry, 'modifiers'> & {
      modifiers?: FeatureStatModifiers;
    }
  ) => void
) {
  const traitBonus = (
    entry.item as { traitBonus?: { trait?: string; bonus?: number } }
  )?.traitBonus;
  if (
    !traitBonus?.trait ||
    typeof traitBonus.bonus !== 'number' ||
    !(TRAITS as string[]).includes(traitBonus.trait)
  ) {
    return;
  }
  pushSource({
    type: 'inventory-item',
    sourceName: itemName,
    detail: `Trait Bonus: ${traitBonus.trait}`,
    modifiers: {
      traits: { [traitBonus.trait]: traitBonus.bonus },
    },
  });
}

function pushInventoryFeatureSources(
  entry: InventoryState['items'][number],
  itemName: string,
  context: ModifierContext,
  pushSource: (
    entry: Omit<BonusSourceEntry, 'modifiers'> & {
      modifiers?: FeatureStatModifiers;
    }
  ) => void
) {
  for (const feature of entry.item?.features ?? []) {
    pushSource({
      type: 'inventory-feature',
      sourceName: itemName,
      detail: feature.name,
      modifiers: resolveModifiers(feature, context),
    });
  }
}
