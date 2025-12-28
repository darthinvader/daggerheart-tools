import type { ConditionsState } from '@/components/conditions';
import type { ExperiencesState } from '@/components/experiences';
import type { ProgressionState } from '@/components/shared/progression-display';
import { getClassByName, getSubclassByName } from '@/lib/data/classes';
import type {
  Gold,
  IdentityFormValues,
  ThresholdsSettings,
} from '@/lib/schemas/character-state';
import type { ClassSelection } from '@/lib/schemas/class-selection';
import type { InventoryState } from '@/lib/schemas/equipment';
import {
  type AncestrySelection,
  type CommunitySelection,
  getAncestryByName,
  getCommunityByName,
} from '@/lib/schemas/identity';
import {
  DEFAULT_LOADOUT,
  type DomainCardLite,
  type LoadoutSelection,
} from '@/lib/schemas/loadout';

const sampleCard = (
  name: string,
  domain: string,
  level: number,
  type: string,
  hopeCost?: number
): DomainCardLite => ({
  name,
  domain,
  level,
  type,
  description: `A ${domain.toLowerCase()} ability: ${name.toLowerCase()}.`,
  hopeCost,
  recallCost: type === 'Spell' ? 1 : undefined,
});

export const buildClassSelection = (): ClassSelection | null => {
  const gameClass = getClassByName('Wizard');
  const subclass = getSubclassByName('Wizard', 'School of Knowledge');
  if (!gameClass || !subclass) return null;
  return {
    mode: 'standard',
    className: 'Wizard',
    subclassName: 'School of Knowledge',
    domains: [...gameClass.domains],
    isHomebrew: false,
    spellcastTrait:
      'spellcastTrait' in subclass ? subclass.spellcastTrait : undefined,
  };
};

export const SAMPLE_IDENTITY: IdentityFormValues = {
  name: 'Eryndor Ashwhisper',
  pronouns: 'he/him',
  calling: 'The Ember Sage',
  description:
    'A wandering scholar seeking ancient fire magic long thought lost to the ages.',
  background:
    'Former apprentice at the Arcane Academy who discovered forbidden texts.',
  descriptionDetails: {},
  connections: [
    {
      prompt: 'Who taught you magic?',
      answer: 'Archmage Theloria, before her disappearance.',
    },
  ],
};

export const SAMPLE_ANCESTRY: AncestrySelection = {
  mode: 'standard',
  ancestry: getAncestryByName('Elf')!,
};

export const SAMPLE_COMMUNITY: CommunitySelection = {
  mode: 'standard',
  community: getCommunityByName('Loreborne')!,
};

export const SAMPLE_PROGRESSION: ProgressionState = {
  currentLevel: 3,
  currentTier: '2-4',
  experience: 750,
  experienceToNext: 1000,
};

export const SAMPLE_GOLD: Gold = {
  handfuls: 5,
  bags: 2,
  chests: 0,
  coins: 0,
  showCoins: false,
  displayDenomination: 'handfuls',
};

export const SAMPLE_THRESHOLDS: ThresholdsSettings = {
  auto: false,
  autoMajor: true,
  values: { major: 4, severe: 8, critical: 16, dsOverride: false, ds: 0 },
  enableCritical: false,
};

export const SAMPLE_INVENTORY: InventoryState = {
  maxSlots: 30,
  items: [],
};

export const SAMPLE_LOADOUT: LoadoutSelection = {
  ...DEFAULT_LOADOUT,
  mode: 'class-domains',
  classDomains: ['Sage', 'Arcana'],
  activeCards: [
    sampleCard('Firebolt', 'Arcana', 1, 'Spell', 1),
    sampleCard('Shield', 'Codex', 1, 'Ability', 2),
    sampleCard('Magic Missile', 'Arcana', 1, 'Spell', 1),
  ],
  vaultCards: [sampleCard('Counterspell', 'Arcana', 3, 'Spell', 2)],
  creationComplete: true,
};

export const SAMPLE_EXPERIENCES: ExperiencesState = {
  items: [
    { id: '1', name: 'Arcane Studies', value: 3 },
    { id: '2', name: 'Combat Training', value: 2 },
  ],
};

export const SAMPLE_CONDITIONS: ConditionsState = {
  items: ['Inspired'],
};
