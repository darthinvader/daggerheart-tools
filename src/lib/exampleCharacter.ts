/**
 * Example Character: Enhanced Daggerheart Model Demonstration
 * 
 * This demonstrates the complete enhanced character model including:
 * - All core SRD mechanics
 * - Death moves and advancement systems
 * - Dynamic state tracking
 * - Enhanced equipment and domain systems
 */

import type {
  PlayerCharacter,
  WeaponFeature,
  ArmorFeature,
  Weapon,
  Armor,
  DomainCard,
  Consumable,
  InventoryItem,
  Condition,
  TemporaryEffect,
  AdvancementChoice,
  DeathMove,
  SessionState,
} from './daggerheartCharacter';

import {
  DEFAULT_HIT_POINTS,
  DEFAULT_STRESS,
  DEFAULT_FEAR_STATE,
  DEFAULT_MORTALITY_STATE,
  DEFAULT_ACTION_ECONOMY,
  deriveTier,
} from './daggerheartCharacter';

///////////////////////////
// Example Equipment     //
///////////////////////////

const rapierFeature: WeaponFeature = {
  name: "Quick",
  type: "Quick",
  description: "When you make an attack, you can mark a Stress to target another creature within range.",
  mechanicalEffect: "Mark 1 stress for additional attack",
  trigger: "On attack",
  cost: "1 stress"
};

const pairedDaggerFeature: WeaponFeature = {
  name: "Paired",
  type: "Paired",
  description: "+2 to primary weapon damage to targets within Melee range",
  mechanicalEffect: "+2 damage when paired with primary"
};

const examplePrimaryWeapon: Weapon = {
  id: "weapon-rapier-001",
  name: "Elegant Rapier",
  category: "Primary",
  trait: "Presence",
  range: "Melee",
  damageDie: "d8",
  damageType: "phy",
  burden: "One-Handed",
  features: [rapierFeature],
  tags: ["finesse", "dueling"],
  data: {
    description: "A finely crafted blade favored by duelists",
    value: "50 gold handfuls"
  }
};

const exampleSecondaryWeapon: Weapon = {
  id: "weapon-dagger-001",
  name: "Paired Dagger",
  category: "Secondary",
  trait: "Finesse",
  range: "Melee",
  damageDie: "d8",
  damageType: "phy",
  burden: "One-Handed",
  features: [pairedDaggerFeature],
  tags: ["light", "thrown"],
  data: {}
};

const flexibleFeature: ArmorFeature = {
  name: "Flexible",
  description: "+1 to Evasion",
  mechanicalEffect: "+1 evasion"
};

const exampleArmor: Armor = {
  id: "armor-gambeson-001",
  name: "Fine Gambeson",
  baseMajorThreshold: 5,
  baseSevereThreshold: 11,
  baseArmorScore: 3,
  features: [flexibleFeature],
  tags: ["light", "padded"],
  data: {
    description: "Well-made padded armor that doesn't restrict movement"
  }
};

const healthPotion: Consumable = {
  id: "consumable-health-001",
  name: "Minor Health Potion",
  type: "Health Potion",
  effect: "Clear 1d4 Hit Points",
  useAction: "Major Action",
  quantity: 2,
  tags: ["healing", "consumable"],
  data: {}
};

const staminaPotion: Consumable = {
  id: "consumable-stamina-001",
  name: "Minor Stamina Potion",
  type: "Stamina Potion",
  effect: "Clear 1d4 Stress",
  useAction: "Major Action",
  quantity: 1,
  tags: ["recovery", "consumable"],
  data: {}
};

const torch: InventoryItem = {
  id: "item-torch-001",
  name: "Torch",
  quantity: 3,
  description: "Provides light in dark areas",
  tags: ["light", "utility"],
  data: {}
};

const rope: InventoryItem = {
  id: "item-rope-001",
  name: "Rope (50 ft)",
  quantity: 1,
  description: "Strong hemp rope",
  tags: ["utility", "climbing"],
  data: {}
};

///////////////////////////
// Example Domain Cards  //
///////////////////////////

const inspiringWordsCard: DomainCard = {
  id: "grace-inspiring-words-001",
  level: 1,
  domain: "Grace",
  type: "ability",
  title: "Inspiring Words",
  recallCost: 1,
  text: "Spend a Hope to give an ally within Close range a +2 bonus to their next roll.",
  usage: {
    usesPerSession: 3,
    usesPerRest: 1,
    currentUses: 2,
    unlimited: false
  },
  inVault: false,
  tags: ["support", "ally"],
  data: {}
};

const mockingTauntCard: DomainCard = {
  id: "grace-mocking-taunt-001",
  level: 2,
  domain: "Grace",
  type: "ability",
  title: "Mocking Taunt",
  recallCost: 2,
  text: "Target within Far range must make a Presence reaction roll or become temporarily Distracted.",
  usage: {
    unlimited: true,
    currentUses: 0
  },
  inVault: true,
  tags: ["control", "debuff"],
  data: {}
};

///////////////////////////
// Example Dynamic State //
///////////////////////////

const distractedCondition: Condition = {
  type: "Distracted",
  duration: "temporary",
  source: "Mocking Taunt",
  effect: "-2 penalty to Difficulty"
};

const bardInspiration: TemporaryEffect = {
  id: "temp-bard-inspiration-001",
  name: "Bard's Inspiration",
  description: "Feeling inspired by an ally's performance",
  duration: "scene",
  source: "Ally's Rally ability",
  mechanicalEffect: "+1 to next action roll",
  tags: ["inspiration", "ally"]
};

const currentSession: SessionState = {
  sessionNumber: 5,
  startDate: new Date('2025-08-05T19:00:00'),
  restsTaken: 1,
  majorMilestones: [
    "Defeated the Shadow Bandits",
    "Discovered the ancient library",
    "Made alliance with local merchants"
  ],
  notes: "Party investigating mysterious disappearances in the trading post"
};

///////////////////////////
// Example Advancement   //
///////////////////////////

const traitAdvancement: AdvancementChoice = {
  type: "trait_bonus",
  description: "Gain a +1 bonus to two unmarked character traits",
  taken: true,
  level: 2,
  tier: 2,
  data: { traitsChosen: ["Presence", "Knowledge"] }
};

const domainCardAdvancement: AdvancementChoice = {
  type: "domain_card",
  description: "Choose an additional domain card of your level or lower",
  taken: false,
  level: 3,
  tier: 2,
  requirements: ["Must be from accessible domain"]
};

///////////////////////////
// Example Death Move    //
///////////////////////////

// Example death move available for character if needed
export const inspiringSacrifice: DeathMove = {
  type: "Inspiring Sacrifice",
  description: "In your final moments, you inspire your allies with a rousing speech",
  mechanicalEffect: "All allies gain 2 Hope and advantage on their next roll",
  narrativeOutcome: "Your words echo in your companions' hearts",
  affectedCharacters: ["all-allies"],
  data: {}
};

///////////////////////////
// Complete Example Character //
///////////////////////////

export const elaraTheBard: PlayerCharacter = {
  // Core Identity
  id: "char-elara-moonwhisper-001",
  name: "Elara Moonwhisper",
  pronouns: "she/her",
  description: "A charismatic half-elf bard with silver hair and eyes like starlight, carrying an ornate lute and dressed in traveling clothes adorned with small bells.",

  // Core Stats  
  level: 3,
  tier: deriveTier(3),
  evasion: 11, // Base 10 + 1 from flexible armor
  proficiency: 2,

  // Character Building
  traits: {
    Agility: 0,
    Strength: -1,
    Finesse: 1,
    Instinct: 0,
    Presence: 3, // 2 base + 1 from advancement
    Knowledge: 2, // 1 base + 1 from advancement
  },

  experiences: [
    {
      id: "exp-performer-001",
      name: "Traveling Performer",
      modifier: 2,
      timesUsed: 4,
      notes: "Experience performing in taverns and courts across the realm"
    },
    {
      id: "exp-silver-tongue-001",
      name: "Silver Tongue",
      modifier: 2,
      timesUsed: 2,
      notes: "Natural talent for persuasion and deception"
    }
  ],

  domains: {
    deck: {
      "grace-inspiring-words-001": inspiringWordsCard,
      "grace-mocking-taunt-001": mockingTauntCard
    },
    loadout: {
      active: ["grace-inspiring-words-001"],
      vault: ["grace-mocking-taunt-001"]
    }
  },

  // Heritage & Class
  heritage: {
    ancestry: "Elf",
    ancestryFeatures: [
      {
        name: "Quick Reactions",
        text: "When you fail a roll with Fear, you may immediately reroll that die."
      },
      {
        name: "Otherworldly",
        text: "You have an innate connection to magic that flows through everything."
      }
    ],
    community: "Wanderborne",
    communityFeature: {
      name: "Nomadic Pack",
      text: "Once per session, spend a Hope to pull out a useful mundane item from your pack."
    },
    notes: "Grew up traveling between elven courts and human settlements"
  },

  classKit: {
    className: "Bard",
    startingEvasion: 10,
    startingHP: 5,
    classItems: ["Romance Novel"],
    classFeature: {
      name: "Rally",
      text: "Once per session, describe how you rally the party and give yourself and each of your allies a Rally Die.",
      actionType: "Major Action",
      cost: "Once per session"
    },
    classHopeFeature: {
      name: "Make a Scene",
      cost: 3,
      text: "Spend 3 Hope to temporarily Distract a target within Close range, giving them a −2 penalty to their Difficulty.",
      timesUsed: 0
    },
    subclasses: [
      {
        name: "Troubadour",
        foundation: {
          name: "Social Butterfly",
          text: "When you succeed on a Presence roll during a social interaction, gain a Hope."
        }
      },
      {
        name: "Wordsmith",
        foundation: {
          name: "Inspiring Word",
          text: "Spend a Hope to give an ally within Close range a +2 to their next roll."
        }
      }
    ],
    domains: ["Grace", "Codex"]
  },

  subclass: {
    name: "Troubadour",
    foundation: {
      name: "Social Butterfly",
      text: "When you succeed on a Presence roll during a social interaction, gain a Hope."
    }
  },

  // Resources
  resources: {
    hp: {
      ...DEFAULT_HIT_POINTS,
      maxSlots: 5,
      marked: 1,
      temporaryBonus: 0
    },
    stress: {
      ...DEFAULT_STRESS,
      maxSlots: 6,
      marked: 2,
      temporaryBonus: 0
    },
    armor: {
      majorThreshold: 8, // 5 base + 3 level
      severeThreshold: 14, // 11 base + 3 level  
      armorScore: 3,
      markedSlots: 0,
      temporaryBonus: 0
    },
    hope: {
      current: 3,
      maximum: 6,
      sessionGenerated: 2
    },
    fear: {
      ...DEFAULT_FEAR_STATE,
      current: 1,
      sessionGenerated: 1,
      effects: ["Slightly on edge from recent encounters"]
    },
    classMeters: {
      rally: {
        die: "d6",
        distributed: false,
        sessionUsed: false
      }
    },
    gold: {
      handfuls: 3,
      bags: 0,
      chests: 0
    }
  },

  // Equipment
  equipment: {
    activeWeapons: {
      primary: examplePrimaryWeapon,
      secondary: exampleSecondaryWeapon
    },
    inventoryWeapons: [],
    activeArmor: exampleArmor,
    inventory: [torch, rope, {
      id: "item-lute-001",
      name: "Masterwork Lute",
      quantity: 1,
      description: "A beautiful lute made of moonwood with silver strings",
      tags: ["instrument", "focus", "valuable"],
      data: { spellcastingFocus: true }
    }],
    consumables: [healthPotion, staminaPotion]
  },

  // Narrative
  background: {
    notes: "Elara was born to an elven mother and human father in a traveling caravan. She learned music and storytelling from the diverse cultures she encountered.",
    questions: [
      {
        question: "What song reminds you of home?",
        answer: "A lullaby my mother sang, mixing elven and human melodies"
      },
      {
        question: "Who taught you your most important lesson?",
        answer: "An old human bard named Marcus, who showed me that stories can heal or harm"
      }
    ],
    bonds: ["The safety of traveling merchants", "Preserving cultural stories"],
    ideals: ["Art should bring people together, not divide them"],
    flaws: ["Sometimes too trusting of charming strangers"],
    secrets: ["Carries a letter from her elven grandmother she's never opened"]
  },

  connections: [
    {
      pcId: "char-thorin-001",
      pcName: "Thorin Ironforge",
      description: "Met when Elara talked us out of a bar fight. He's surprisingly gentle for a warrior.",
      strength: "strong",
      type: "friendly",
      notes: "He seems to appreciate her music after long days"
    },
    {
      pcId: "char-zara-001",
      pcName: "Zara Nightwhisper",
      description: "Fellow performer, but they compete for attention. Complicated relationship.",
      strength: "moderate",
      type: "rival",
      notes: "Professional rivalry that might be turning into friendship"
    }
  ],

  // Advancement
  advancement: {
    availableChoices: [domainCardAdvancement],
    choicesMade: [traitAdvancement],
    milestones: [
      "First successful performance in a major city",
      "Helped resolve merchant dispute peacefully",
      "Learned a song from an ancient culture"
    ]
  },

  // Mortality
  mortality: {
    ...DEFAULT_MORTALITY_STATE,
    deathMoveUsed: undefined // Available if needed
  },

  // Dynamic State
  dynamicState: {
    currentSession: currentSession,
    conditions: [distractedCondition],
    temporaryEffects: [bardInspiration],
    actionEconomy: {
      ...DEFAULT_ACTION_ECONOMY,
      majorActionsUsed: 1,
      minorActionsUsed: 0,
      reactionsUsed: 0,
      canAct: true
    },
    lastRollResult: {
      type: "Presence (Social Interaction)",
      total: 16,
      hopeGenerated: 1,
      fearGenerated: 0,
      timestamp: new Date('2025-08-05T21:30:00')
    }
  },

  // Extensibility
  tags: ["social", "support", "performer", "traveler"],
  data: {
    playerNotes: "Focus on social encounters and ally support",
    gmNotes: "Good source of information about different cultures",
    favoriteSpells: ["Inspiring Words", "Rally"],
    personalQuest: "Find her elven grandmother and deliver the letter"
  }
};

///////////////////////////
// Character Validation  //
///////////////////////////

// Example of validating the character
import { validateCharacter, getSRDCompliance } from './daggerheartValidation';

export function validateElaraExample(): void {
  console.log('=== Validating Example Character: Elara Moonwhisper ===');

  const validation = validateCharacter(elaraTheBard);
  console.log('Overall Validation:', validation);

  const srdCompliance = getSRDCompliance(elaraTheBard);
  console.log('SRD Compliance:', srdCompliance);

  if (validation.valid) {
    console.log('✅ Elara is a valid character!');
  } else {
    console.log('❌ Validation errors found:');
    validation.errors.forEach(error => console.log(`  - ${error}`));
  }

  if (validation.warnings.length > 0) {
    console.log('⚠️ Warnings:');
    validation.warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  if (validation.info.length > 0) {
    console.log('ℹ️ Info:');
    validation.info.forEach(info => console.log(`  - ${info}`));
  }
}

export default elaraTheBard;
