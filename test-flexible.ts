/* eslint-disable no-console */
import { PlayerCharacterSchema } from './src/lib/schemas/player-character';

// Test the flexible schema with various card combinations
const flexibleCharacter = {
  name: 'Flexible Character',
  level: 5,
  characterClass: 'Wizard' as const,
  subclass: 'Transmuter' as const,
  spellcastingTrait: 'Knowledge' as const,
  ancestry: { name: 'Human' as const, abilities: [] },
  community: { name: 'Loreborne' as const, abilities: [] },
  traits: {
    Agility: { value: 2, marked: false },
    Strength: { value: 1, marked: false },
    Finesse: { value: 3, marked: false },
    Instinct: { value: 2, marked: false },
    Presence: { value: 2, marked: false },
    Knowledge: { value: 4, marked: false },
  },
  hp: { current: 15, max: 15, thresholds: { major: 7, severe: 12 } },
  stress: { current: 1, max: 6 },
  armorScore: { current: 13, max: 13 },
  evasion: 13,
  hope: 2,
  proficiency: 2,

  // Flexible domain card collections - no restrictions!
  domainCards: [
    {
      name: 'Custom Card',
      level: 3,
      domain: 'Arcana' as const,
      type: 'Spell' as const,
      recallCost: 2,
      description: 'A custom card for testing',
    },
    {
      name: 'Another Card',
      level: 1,
      domain: 'Midnight' as const,
      type: 'Ability' as const,
      recallCost: 0,
      description: 'Another test card',
    },
  ],
  vault: [
    {
      name: 'Vault Card',
      level: 2,
      domain: 'Grace' as const,
      type: 'Spell' as const,
      recallCost: 1,
      description: 'Stored in vault',
    },
  ],
  loadout: [
    {
      name: 'Active Card',
      level: 4,
      domain: 'Blade' as const,
      type: 'Ability' as const,
      recallCost: 0,
      description: 'Ready for use',
    },
  ],

  classFeatures: [],
  weapons: [],
  armor: [],
  inventory: [],
  gold: { handfuls: 5, bags: 2, chests: 0 },
  experience: [],
  tierAdvancement: {},
};

try {
  const result = PlayerCharacterSchema.parse(flexibleCharacter);
  console.log('✅ Flexible schema validation passed!');
  console.log('Total cards:', result.domainCards.length);
  console.log('Vault cards:', result.vault.length);
  console.log('Loadout cards:', result.loadout.length);
  console.log('Cards can be different across collections - no restrictions!');
} catch (error) {
  console.error('❌ Validation failed:', error);
}
