/* eslint-disable no-console */
import { PlayerCharacterSchema } from './src/lib/schemas/player-character';

// Test basic schema validation
const sampleCharacter = {
  name: 'Test Character',
  level: 1,
  characterClass: 'Wizard' as const,
  subclass: 'Transmuter' as const,
  spellcastingTrait: 'Knowledge' as const,
  ancestry: {
    name: 'Human' as const,
    abilities: [],
  },
  community: {
    name: 'Loreborne' as const,
    abilities: [],
  },
  traits: {
    Agility: { value: 2, marked: false },
    Strength: { value: 1, marked: false },
    Finesse: { value: 3, marked: false },
    Instinct: { value: 2, marked: false },
    Presence: { value: 2, marked: false },
    Knowledge: { value: 4, marked: false },
  },
  hp: {
    current: 10,
    max: 10,
    thresholds: { major: 5, severe: 8 },
  },
  stress: { current: 0, max: 5 },
  armorScore: { current: 12, max: 12 },
  evasion: 12,
  hope: 3,
  proficiency: 1,

  // Test the new domain card collections
  domainCards: [
    {
      name: 'RUNE WARD',
      level: 1,
      domain: 'Arcana' as const,
      type: 'Spell' as const,
      recallCost: 0,
      description: 'Test card',
    },
  ],
  vault: [],
  loadout: [
    {
      name: 'RUNE WARD',
      level: 1,
      domain: 'Arcana' as const,
      type: 'Spell' as const,
      recallCost: 0,
      description: 'Test card',
    },
  ],

  classFeatures: [],
  weapons: [],
  armor: [],
  inventory: [],
  gold: { handfuls: 0, bags: 0, chests: 0 },
  experience: [],
  tierAdvancement: {},
};

// Test validation
try {
  const result = PlayerCharacterSchema.parse(sampleCharacter);
  console.log('✅ Schema validation passed!');
  console.log('Character has:', result.domainCards.length, 'total cards');
  console.log('Loadout has:', result.loadout.length, 'active cards');
} catch (error) {
  console.error('❌ Schema validation failed:', error);
}
