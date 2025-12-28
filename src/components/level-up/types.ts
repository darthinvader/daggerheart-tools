import type { CharacterTier } from '@/lib/schemas/core';

export interface LevelUpOptionConfig {
  id: string;
  label: string;
  description: string;
  cost: 1 | 2;
  maxSelections: number;
  maxScope: 'tier' | 'lifetime';
  requiresSubModal: boolean;
  subModalType?:
    | 'traits'
    | 'experiences'
    | 'domain-card'
    | 'hp'
    | 'stress'
    | 'evasion'
    | 'proficiency'
    | 'subclass'
    | 'multiclass';
  availableInTiers: CharacterTier[];
  disabledBy?: string[];
}

export interface LevelUpSelection {
  optionId: string;
  count: number;
  details?: LevelUpSelectionDetails;
}

export interface SubclassUpgradeSelection {
  className: string;
  subclassName: string;
  featureName: string;
  featureType: 'specialization' | 'mastery';
}

export interface LevelUpSelectionDetails {
  selectedTraits?: string[];
  selectedExperiences?: string[];
  selectedDomainCard?: string;
  selectedMulticlass?: {
    className: string;
    subclassName: string;
    domains: string[];
  };
  selectedSubclassUpgrade?: SubclassUpgradeSelection;
}

export interface TierSelectionHistory {
  tier: CharacterTier;
  selections: Record<string, number>;
}

export interface LevelUpState {
  targetLevel: number;
  targetTier: CharacterTier;
  pointsAvailable: number;
  pointsSpent: number;
  selections: LevelUpSelection[];
  pendingOption: LevelUpOptionConfig | null;
}

export const LEVEL_UP_OPTIONS_CONFIG: LevelUpOptionConfig[] = [
  {
    id: 'traits',
    label: 'Boost Two Traits',
    description:
      'Gain a +1 bonus to two unmarked character traits and mark them.',
    cost: 1,
    maxSelections: 3,
    maxScope: 'tier',
    requiresSubModal: true,
    subModalType: 'traits',
    availableInTiers: ['2-4', '5-7', '8-10'],
  },
  {
    id: 'hp',
    label: 'Gain Hit Point Slot',
    description: 'Permanently gain one Hit Point slot.',
    cost: 1,
    maxSelections: 2,
    maxScope: 'lifetime',
    requiresSubModal: false,
    subModalType: 'hp',
    availableInTiers: ['2-4', '5-7', '8-10'],
  },
  {
    id: 'stress',
    label: 'Gain Stress Slot',
    description: 'Permanently gain one Stress slot.',
    cost: 1,
    maxSelections: 2,
    maxScope: 'lifetime',
    requiresSubModal: false,
    subModalType: 'stress',
    availableInTiers: ['2-4', '5-7', '8-10'],
  },
  {
    id: 'experiences',
    label: 'Boost Two Experiences',
    description: 'Permanently gain a +1 bonus to two Experiences.',
    cost: 1,
    maxSelections: 1,
    maxScope: 'tier',
    requiresSubModal: true,
    subModalType: 'experiences',
    availableInTiers: ['2-4', '5-7', '8-10'],
  },
  {
    id: 'domain-card',
    label: 'Domain Card',
    description:
      'Choose an additional domain card of your level or lower from a domain you have access to.',
    cost: 1,
    maxSelections: 1,
    maxScope: 'tier',
    requiresSubModal: true,
    subModalType: 'domain-card',
    availableInTiers: ['2-4', '5-7', '8-10'],
  },
  {
    id: 'evasion',
    label: 'Boost Evasion',
    description: 'Permanently gain a +1 bonus to your Evasion.',
    cost: 1,
    maxSelections: 1,
    maxScope: 'lifetime',
    requiresSubModal: false,
    subModalType: 'evasion',
    availableInTiers: ['2-4', '5-7', '8-10'],
  },
  {
    id: 'proficiency',
    label: 'Boost Proficiency',
    description:
      'Increase your Proficiency by +1. This costs 2 advancement slots.',
    cost: 2,
    maxSelections: 1,
    maxScope: 'tier',
    requiresSubModal: false,
    subModalType: 'proficiency',
    availableInTiers: ['5-7', '8-10'],
  },
  {
    id: 'subclass',
    label: 'Upgraded Subclass Card',
    description:
      'Take the next subclass card (specialization or mastery). This locks out multiclass for this tier.',
    cost: 1,
    maxSelections: 1,
    maxScope: 'tier',
    requiresSubModal: true,
    subModalType: 'subclass',
    availableInTiers: ['5-7', '8-10'],
    disabledBy: ['multiclass'],
  },
  {
    id: 'multiclass',
    label: 'Multiclass',
    description:
      'Choose an additional class for your character, then cross out an unused Take an upgraded subclass card and the other multiclass option',
    cost: 2,
    maxSelections: 1,
    maxScope: 'tier',
    requiresSubModal: true,
    subModalType: 'multiclass',
    availableInTiers: ['5-7', '8-10'],
    disabledBy: ['subclass'],
  },
];

export function getOptionsForTier(tier: CharacterTier): LevelUpOptionConfig[] {
  return LEVEL_UP_OPTIONS_CONFIG.filter(opt =>
    opt.availableInTiers.includes(tier)
  );
}

export function isOptionDisabled(
  option: LevelUpOptionConfig,
  currentSelections: LevelUpSelection[],
  tierHistory: Record<string, number>
): boolean {
  if (!option.disabledBy || option.disabledBy.length === 0) return false;

  const disabledByCurrent = option.disabledBy.some(disablerId =>
    currentSelections.some(sel => sel.optionId === disablerId && sel.count > 0)
  );

  const disabledByHistory = option.disabledBy.some(
    disablerId => (tierHistory[disablerId] ?? 0) > 0
  );

  return disabledByCurrent || disabledByHistory;
}

export function getSelectionCount(
  optionId: string,
  selections: LevelUpSelection[]
): number {
  return selections.find(s => s.optionId === optionId)?.count ?? 0;
}

export function getTotalSelectionCount(
  option: LevelUpOptionConfig,
  currentSelections: LevelUpSelection[],
  tierHistory: Record<string, number>,
  lifetimeHistory: Record<string, number>
): number {
  const currentCount = getSelectionCount(option.id, currentSelections);
  const history =
    option.maxScope === 'lifetime' ? lifetimeHistory : tierHistory;
  const historyCount = history[option.id] ?? 0;
  return currentCount + historyCount;
}

export function isOptionMaxed(
  option: LevelUpOptionConfig,
  currentSelections: LevelUpSelection[],
  tierHistory: Record<string, number>,
  lifetimeHistory: Record<string, number>
): boolean {
  const totalCount = getTotalSelectionCount(
    option,
    currentSelections,
    tierHistory,
    lifetimeHistory
  );
  return totalCount >= option.maxSelections;
}

export function getAutomaticBenefits(
  level: number,
  tierChanged: boolean
): string[] {
  const benefits: string[] = [];

  if (level === 2 || level === 5 || level === 8) {
    benefits.push('Gain an additional Experience at +2');
    benefits.push('Gain +1 Proficiency');
  }

  if (tierChanged && level > 1) {
    benefits.push('Clear all marks on character traits');
  }

  benefits.push('Damage thresholds increase by +1');
  benefits.push('Take a domain card of your level or lower');

  return benefits;
}
