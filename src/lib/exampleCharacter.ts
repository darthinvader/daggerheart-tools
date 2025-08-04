// Example Daggerheart Character Creation
// Demonstrates how to use the character types and validation

import type {
  DaggerheartCharacter,
  Heritage,
  CharacterClass,
  Subclass,
  TraitModifier,
  Experience,
  DomainCard
} from './daggerheartCharacter';

import {
  validateCharacter,
  calculateDerivedStats
} from './daggerheartValidation';

// ============================================================================
// EXAMPLE CHARACTER: ELARA THE ELVEN BARD
// ============================================================================

/**
 * Creates an example Daggerheart character following the SRD rules
 */
export function createExampleCharacter(): DaggerheartCharacter {
  // Heritage: Elf from Loreborne community
  const heritage: Heritage = {
    ancestry: {
      name: 'Elf',
      description: 'Graceful and long-lived people with a deep connection to magic',
      firstFeature: {
        name: 'Elven Grace',
        description: 'Natural agility and connection to the magical realm',
        position: 'top',
        featureType: 'reaction_bonus'
      },
      secondFeature: {
        name: 'Keen Senses',
        description: 'Enhanced perception and awareness of surroundings',
        position: 'bottom',
        featureType: 'information'
      }
    },
    community: {
      name: 'Loreborne',
      description: 'People dedicated to preserving knowledge and ancient wisdom',
      feature: {
        name: 'Scholar\'s Mind',
        description: 'Enhanced ability to recall and analyze information'
      }
    }
  };

  // Class: Bard (Codex & Grace domains)
  const characterClass: CharacterClass = {
    name: 'Bard',
    description: 'Masters of captivation who specialize in performance and social situations',
    domains: ['Codex', 'Grace'],
    startingEvasion: 12,
    startingHitPoints: 18,
    classFeatures: [
      {
        name: 'Bardic Inspiration',
        description: 'Inspire allies with magical performances',
        level: 1,
        type: 'Class'
      }
    ],
    hopeFeature: {
      name: 'Encore',
      description: 'Spend 3 Hope to repeat a performance with enhanced effect',
      level: 1,
      type: 'Hope'
    },
    startingEquipment: ['Musical instrument', 'Scholar\'s pack']
  };

  // Subclass: College of Eloquence (example)
  const subclass: Subclass = {
    name: 'College of Eloquence',
    parentClass: 'Bard',
    description: 'Masters of persuasive speech and compelling storytelling',
    spellcastTrait: 'Presence',
    foundationFeature: {
      name: 'Silver Tongue',
      description: 'Enhanced persuasion and social manipulation abilities',
      level: 1,
      type: 'Foundation'
    },
    specializationFeature: {
      name: 'Compelling Speech',
      description: 'Force opponents to listen and be affected by your words',
      level: 3,
      type: 'Specialization'
    },
    masteryFeature: {
      name: 'Master Orator',
      description: 'Ultimate mastery of language and crowd control',
      level: 7,
      type: 'Mastery'
    }
  };

  // Trait assignment: +2, +1, +1, +0, +0, -1 (flexible to any trait names)
  const traits: Record<string, TraitModifier> = {
    'Presence': 2,    // Primary trait for Bard
    'Knowledge': 1,   // Secondary for Codex domain
    'Finesse': 1,     // For precise performances
    'Agility': 0,     // Neutral
    'Instinct': 0,    // Neutral
    'Strength': -1    // Dump stat
  };

  // Experiences (2 at character creation, each +2)
  const experiences: Experience[] = [
    {
      name: 'Court Musician',
      modifier: 2,
      description: 'Performed for nobility and learned courtly etiquette'
    },
    {
      name: 'Traveling Storyteller',
      modifier: 2,
      description: 'Wandered the realm collecting and sharing tales'
    }
  ];

  // Example domain cards (2 level 1 cards from Codex and Grace)
  const loadout: DomainCard[] = [
    {
      name: 'Inspiring Words',
      domain: 'Grace',
      level: 1,
      type: 'Ability',
      recallCost: 0,
      description: 'Use compelling speech to inspire allies in combat',
      features: [
        {
          description: 'Spend Hope to give an ally advantage on their next roll',
          usageLimit: {
            uses: 3,
            reset: 'Rest'
          }
        }
      ]
    },
    {
      name: 'Lore Recall',
      domain: 'Codex',
      level: 1,
      type: 'Ability',
      recallCost: 1,
      description: 'Draw upon extensive knowledge to aid the party',
      features: [
        {
          description: 'Automatically succeed on Knowledge rolls about history, magic, or cultures'
        }
      ]
    }
  ];

  // Calculate derived stats
  const exampleArmor = {
    baseThresholds: { minor: 3, major: 8 },
    baseScore: 11
  };

  const derivedStats = calculateDerivedStats(18, 12, 1, exampleArmor); // hitPoints, evasion, level, armor

  // Create the complete character
  const character: DaggerheartCharacter = {
    name: 'Elara Moonwhisper',
    pronouns: 'she/her',
    description: 'A graceful elf with silver hair and eyes that sparkle with ancient wisdom',
    level: 1,

    heritage,
    class: characterClass,
    subclass,
    traits,

    hitPoints: {
      current: derivedStats.hitPoints,
      maximum: derivedStats.hitPoints
    },
    evasion: derivedStats.evasion,
    stress: derivedStats.stress,
    hope: derivedStats.hope,
    proficiency: derivedStats.proficiency,

    damageThresholds: derivedStats.damageThresholds,
    armorScore: derivedStats.armorScore,

    activeWeapon: {
      primary: {
        name: 'Rapier',
        tier: 1,
        damageDie: 'd6+1',
        properties: ['Finesse', 'Light'],
        isOneHanded: true,
        isTwoHanded: false
      }
    },
    activeArmor: {
      name: 'Leather Armor',
      tier: 1,
      baseScore: 11,
      baseThresholds: { minor: 3, major: 8 },
      properties: ['Light'],
      description: 'Supple leather armor that doesn\'t restrict movement'
    },
    inventory: [
      {
        name: 'Lute',
        type: 'Tool',
        description: 'A finely crafted musical instrument'
      },
      {
        name: 'Scholar\'s Pack',
        type: 'Other',
        description: 'Contains books, parchment, ink, and writing supplies'
      },
      {
        name: 'Minor Health Potion',
        type: 'Consumable',
        description: 'Restores 1d4 Hit Points'
      }
    ],
    gold: {
      handfuls: 1
    },

    loadout,
    vault: [],
    experiences,

    background: {
      description: 'Raised in the grand libraries of the Loreborne, trained as both scholar and performer',
      questions: [
        {
          question: 'What song or story first made you want to become a bard?',
          answer: 'The Ballad of the Silver Phoenix - a tale of hope triumphing over despair'
        },
        {
          question: 'What knowledge do you seek in your adventures?',
          answer: 'The location of the Lost Archive, said to contain songs that can reshape reality'
        },
        {
          question: 'Who was your most important teacher?',
          answer: 'Master Theron, an ancient elf who taught me that every story has power'
        }
      ]
    },

    connections: [
      {
        targetCharacterName: 'Gareth',
        question: 'Which of your songs does this character know by heart?',
        answer: 'The Warrior\'s Lament - I sang it after his first battle when he lost a close friend'
      }
    ],

    notes: 'Seeks to collect lost songs and stories from across the realm. Has a particular interest in magical music.'
  };

  return character;
}

// ============================================================================
// VALIDATION EXAMPLE
// ============================================================================

/**
 * Demonstrates character validation
 */
export function validateExampleCharacter(): void {
  const character = createExampleCharacter();
  const validation = validateCharacter(character);

  console.log('Character Validation Results:');
  console.log('Valid:', validation.isValid);

  if (validation.errors.length > 0) {
    console.log('Errors:');
    validation.errors.forEach(error => console.log('  -', error));
  }

  if (validation.warnings.length > 0) {
    console.log('Warnings:');
    validation.warnings.forEach(warning => console.log('  -', warning));
  }

  if (validation.isValid) {
    console.log('✅ Character is valid according to Daggerheart SRD rules!');
  } else {
    console.log('❌ Character has validation errors that need to be fixed.');
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets the available domains for a character class from standard mapping
 */
export function showClassDomains(className: string): void {
  const standardClasses = {
    'Bard': ['Codex', 'Grace'],
    'Druid': ['Arcana', 'Sage'],
    'Guardian': ['Blade', 'Valor'],
    'Ranger': ['Bone', 'Sage'],
    'Rogue': ['Grace', 'Midnight'],
    'Seraph': ['Splendor', 'Valor'],
    'Sorcerer': ['Arcana', 'Midnight'],
    'Warrior': ['Blade', 'Bone'],
    'Wizard': ['Codex', 'Splendor']
  };

  const domains = standardClasses[className as keyof typeof standardClasses];
  if (domains) {
    console.log(`${className} class domains: ${domains[0]} & ${domains[1]}`);
  } else {
    console.log(`No standard domains found for class: ${className}`);
  }
}

/**
 * Example of displaying all class-domain combinations
 */
export function showAllClassDomains(): void {
  console.log('Daggerheart Class-Domain Combinations:');
  const standardClasses = {
    'Bard': ['Codex', 'Grace'],
    'Druid': ['Arcana', 'Sage'],
    'Guardian': ['Blade', 'Valor'],
    'Ranger': ['Bone', 'Sage'],
    'Rogue': ['Grace', 'Midnight'],
    'Seraph': ['Splendor', 'Valor'],
    'Sorcerer': ['Arcana', 'Midnight'],
    'Warrior': ['Blade', 'Bone'],
    'Wizard': ['Codex', 'Splendor']
  };

  Object.entries(standardClasses).forEach(([className, domains]) => {
    console.log(`  ${className}: ${domains[0]} & ${domains[1]}`);
  });
}

// Export the example for use
export const exampleCharacter = createExampleCharacter();
