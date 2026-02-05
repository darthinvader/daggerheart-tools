/**
 * Difficulty Setting Quick Reference
 * Per Chapter 3 of Daggerheart Rulebook (pages 157-159)
 *
 * Difficulty ranges from 5 (Very Easy) to 30 (Nearly Impossible).
 * Numbers between can be used for finer granularity. Values outside
 * this range are possible to fit exceptional story circumstances.
 *
 * Key guidance from the SRD:
 * - Difficulty doesn't need to be a multiple of 5
 * - You can choose to keep Difficulty secret or tell the player up front
 * - Consider degrees of success/failure based on relative roll results
 * - For adversary action rolls, use their Difficulty from the stat block
 * - Add relevant Experience to adversary's Difficulty for non-attack rolls
 */

// ---------------------------------------------------------------------------
// Difficulty Levels
// ---------------------------------------------------------------------------

export interface DifficultyLevel {
  /** Numeric target value */
  value: number;
  /** Short name for the difficulty tier */
  name: string;
  /** Description of when to use this difficulty */
  description: string;
  /** Example actions at this difficulty level */
  examples: string[];
  /** Color class for UI theming */
  colorClass: string;
}

/**
 * The core difficulty levels from 5 to 30 as defined in the SRD.
 * Use these as quick benchmarks when setting roll Difficulties.
 */
export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    value: 5,
    name: 'Very Easy',
    description: 'Almost automatic success for any adventurer',
    examples: [
      'Lift a chair (Strength)',
      'Trick a trusting acquaintance (Presence)',
      'Hear a loud noise twenty paces away (Instinct)',
      'Sprint within Close range across an open field (Agility)',
      'Ride a horse through easy terrain (Finesse)',
      'Recall uncommon facts about your community (Knowledge)',
    ],
    colorClass: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    value: 10,
    name: 'Easy',
    description: 'Most characters succeed without much trouble',
    examples: [
      'Lift a table or small chest (Strength)',
      'Win the trust of a friendly stranger (Presence)',
      'Hear a speaking voice fifty paces away (Instinct)',
      'Sprint within Far range across an open field (Agility)',
      'Drive an ox-pulled cart (Finesse)',
      'Recall uncommon facts about a neighboring community (Knowledge)',
    ],
    colorClass: 'text-green-600 dark:text-green-400',
  },
  {
    value: 15,
    name: 'Average',
    description: 'Fair challenge requiring some skill or luck',
    examples: [
      'Break through a wooden door (Strength)',
      "Talk your way into a noble's party (Presence)",
      'Hear someone walking in the woods fifty paces away (Instinct)',
      'Sprint within Close range across rough terrain (Agility)',
      'Disable a standard trap (Finesse)',
      'Break an average cipher in a coded message (Knowledge)',
    ],
    colorClass: 'text-sky-600 dark:text-sky-400',
  },
  {
    value: 20,
    name: 'Hard',
    description: 'Skilled characters or good rolls needed',
    examples: [
      'Break through a stone wall (Strength)',
      "Talk your way into an enemy's party (Presence)",
      'Detect a nearby assassin (Instinct)',
      'Sprint through an active battle of multiple enemies (Agility)',
      'Disable a complicated trap (Finesse)',
      'Identify a weakness in a complicated battle plan (Knowledge)',
    ],
    colorClass: 'text-amber-600 dark:text-amber-400',
  },
  {
    value: 25,
    name: 'Very Hard',
    description: 'Exceptional effort or specialization required',
    examples: [
      'Lift a horse, an ox, or a large monster (Strength)',
      'Turn an enemy against their ruler (Presence)',
      "Identify a spymaster's plot (Instinct)",
      'Sprint through a pitched battle in rough terrain (Agility)',
      'Open a door secured by elaborate locks (Finesse)',
      'Predict the downfall of a nation (Knowledge)',
    ],
    colorClass: 'text-orange-600 dark:text-orange-400',
  },
  {
    value: 30,
    name: 'Nearly Impossible',
    description: 'Heroic feat; only the most capable can attempt',
    examples: [
      "Break a god's grip (Strength)",
      'Trick a god (Presence)',
      "Sense doubt within a god's pronouncement (Instinct)",
      'Sprint across the heads of enemies in a pitched battle (Agility)',
      'Disable an incredibly sensitive and deadly trap (Finesse)',
      "Identify the weakness in a divine champion's form (Knowledge)",
    ],
    colorClass: 'text-red-600 dark:text-red-400',
  },
];

/** @deprecated Use DIFFICULTY_LEVELS instead */
export const DIFFICULTY_LADDER = DIFFICULTY_LEVELS;

/**
 * Quick lookup of difficulty by value
 */
export const DIFFICULTY_BY_VALUE: Record<number, DifficultyLevel> =
  Object.fromEntries(DIFFICULTY_LEVELS.map(d => [d.value, d]));

/**
 * Get the closest difficulty name for a given value
 */
export function getDifficultyName(value: number): string {
  if (value <= 5) return 'Very Easy';
  if (value <= 10) return 'Easy';
  if (value <= 15) return 'Average';
  if (value <= 20) return 'Hard';
  if (value <= 25) return 'Very Hard';
  return 'Nearly Impossible';
}

/** @deprecated Use getDifficultyName instead */
export const getDifficultyLabel = getDifficultyName;

// ---------------------------------------------------------------------------
// Trait Actions & Example Difficulties
// ---------------------------------------------------------------------------

export type TraitName =
  | 'Agility'
  | 'Strength'
  | 'Finesse'
  | 'Instinct'
  | 'Presence'
  | 'Knowledge';

export interface TraitAction {
  /** Verb or action type within the trait */
  action: string;
  /** Difficulty examples at each ladder level */
  examples: Record<number, string>;
}

export interface TraitGuidance {
  /** The trait name */
  trait: TraitName;
  /** Brief description of when this trait applies */
  description: string;
  /** Common verbs associated with this trait */
  verbs: string[];
  /** Detailed action examples by difficulty */
  actions: TraitAction[];
}

/**
 * Comprehensive trait guidance with difficulty examples per SRD Chapter 3.
 * Each trait has typical actions and what constitutes each difficulty level.
 * Organized as an object keyed by trait name for easy lookup.
 */
export const TRAIT_DIFFICULTY_GUIDANCE: Record<TraitName, TraitGuidance> = {
  Agility: {
    trait: 'Agility',
    description: 'Speed, reflexes, balance, and acrobatic maneuvers',
    verbs: ['Sprint', 'Leap', 'Maneuver', 'Dodge', 'Balance'],
    actions: [
      {
        action: 'Sprint',
        examples: {
          5: 'Sprint within Close range across an open field with an enemy present',
          10: 'Sprint within Far range across an open field with an enemy present',
          15: 'Sprint within Close range across rough terrain with an enemy present',
          20: 'Sprint within Close range through an active battle of multiple enemies',
          25: 'Sprint within Far range through a pitched battle in rough terrain',
          30: 'Sprint across the heads of your enemies in a pitched battle',
        },
      },
      {
        action: 'Leap',
        examples: {
          5: 'Make a running jump of half your height (about 3 feet for a human)',
          10: 'Make a running jump of your height (about 6 feet for a human)',
          15: 'Make a running jump of double your height (about 12 feet for a human)',
          20: 'Make a running jump of three times your height (about 18 feet for a human)',
          25: 'Make a running jump of five times your height (about 30 feet for a human)',
          30: 'Make a running jump of ten times your height (about 60 feet for a human)',
        },
      },
      {
        action: 'Maneuver',
        examples: {
          5: 'Walk slowly across a narrow beam',
          10: 'Walk quickly across a narrow beam',
          15: 'Run across a narrow beam',
          20: 'Run across a narrow beam in heavy wind',
          25: 'Run across a very narrow beam in an active rainstorm',
          30: 'Run across an inch-wide, oil-slicked beam in an active rainstorm',
        },
      },
    ],
  },
  Strength: {
    trait: 'Strength',
    description: 'Raw physical power for lifting, breaking, and wrestling',
    verbs: ['Lift', 'Smash', 'Grapple', 'Push', 'Climb'],
    actions: [
      {
        action: 'Lift',
        examples: {
          5: 'Lift a chair',
          10: 'Lift a table or small chest',
          15: 'Lift a grown person or large chest',
          20: 'Lift the side of a laden cart or carry a large chest up stairs',
          25: 'Lift a horse, an ox, or a large monster',
          30: 'Lift a falling portcullis gate',
        },
      },
      {
        action: 'Smash',
        examples: {
          5: 'Destroy a glass cup',
          10: 'Destroy a small wooden table',
          15: 'Break through a wooden door',
          20: 'Break through a stone wall',
          25: "Break through a dragon's teeth",
          30: "Break a god's grip",
        },
      },
      {
        action: 'Grapple',
        examples: {
          5: 'Subdue a child',
          10: 'Subdue a weak adult',
          15: 'Subdue an average adult',
          20: 'Subdue a skilled wrestler',
          25: 'Subdue a large beast',
          30: 'Subdue a legendary beast',
        },
      },
    ],
  },
  Finesse: {
    trait: 'Finesse',
    description: 'Precision, dexterity, and fine motor control',
    verbs: ['Control', 'Hide', 'Tinker', 'Pick', 'Craft'],
    actions: [
      {
        action: 'Control',
        examples: {
          5: 'Ride a horse through easy terrain',
          10: 'Drive an ox-pulled cart',
          15: 'Ride a horse through rough terrain',
          20: 'Drive a cart through rough terrain',
          25: 'Ride a wild horse through dangerous terrain',
          30: 'Ride an enraged beast through dangerous terrain',
        },
      },
      {
        action: 'Hide',
        examples: {
          5: 'Evade notice under full cover on a moonless night',
          10: 'Evade notice in limited cover on a moonless night',
          15: 'Evade notice in limited cover on an average night',
          20: 'Evade notice in the shadows on an average night',
          25: 'Evade notice with minimal cover in ample light',
          30: 'Evade notice with no cover in full daylight',
        },
      },
      {
        action: 'Tinker',
        examples: {
          5: 'Open a sticky lock with the appropriate key',
          10: 'Open a simple puzzle box',
          15: 'Disable a standard trap',
          20: 'Disable a complicated trap',
          25: 'Open a door secured by a sequence of elaborate locks',
          30: 'Disable an incredibly sensitive and deadly trap',
        },
      },
    ],
  },
  Instinct: {
    trait: 'Instinct',
    description: 'Perception, intuition, and awareness of surroundings',
    verbs: ['Perceive', 'Sense', 'Navigate', 'Track', 'React'],
    actions: [
      {
        action: 'Perceive',
        examples: {
          5: 'Hear a loud noise twenty paces away',
          10: 'Hear a speaking voice fifty paces away',
          15: 'Hear someone walking in the woods fifty paces away',
          20: 'Hear someone sneaking through the woods fifty paces away',
          25: 'Hear a prowling animal fifty paces away',
          30: 'Hear a diving bird a hundred paces away',
        },
      },
      {
        action: 'Sense',
        examples: {
          5: 'Detect an obvious ambush or notice an obvious deception',
          10: "Detect a looming threat or notice an average person's lies",
          15: "Detect hostile intent from a foe or see through a merchant's lies",
          20: "Detect a politician's veiled hostility or detect a nearby assassin",
          25: "Identify a spymaster's plot or read a politician's true intentions",
          30: "Sense a shred of doubt within a god's pronouncement",
        },
      },
      {
        action: 'Navigate',
        examples: {
          5: 'Follow a well-trod path in good lighting and weather',
          10: 'Follow an average path in good lighting and weather',
          15: 'Follow a subtle path through rough conditions',
          20: 'Follow a subtle path through harsh conditions',
          25: 'Find your way with no path through dangerous conditions',
          30: "Find your way through a trickster god's maze",
        },
      },
    ],
  },
  Presence: {
    trait: 'Presence',
    description: 'Force of personality, charm, and social influence',
    verbs: ['Charm', 'Perform', 'Deceive', 'Intimidate', 'Persuade'],
    actions: [
      {
        action: 'Charm',
        examples: {
          5: 'Win the trust of a friendly neighbor',
          10: 'Win the trust of a friendly stranger',
          15: "Win the trust of a cautious stranger or talk your way into a noble's party",
          20: "Win the trust of a sympathetic foe or talk your way into an enemy's party",
          25: 'Turn an enemy against their ruler or talk your way into a fae court',
          30: 'Talk a hostile god into granting you a boon',
        },
      },
      {
        action: 'Perform',
        examples: {
          5: 'Earn a meal from a friendly crowd',
          10: 'Earn room and board in a small town or impress a small crowd',
          15: 'Earn room and board in a low-end tavern or impress a large crowd',
          20: 'Earn lodging in a high-end tavern or impress a full theater',
          25: 'Earn your keep in a royal court or impress a full colosseum',
          30: 'Save yourself from execution after offending the queen',
        },
      },
      {
        action: 'Deceive',
        examples: {
          5: 'Trick a trusting acquaintance',
          10: 'Trick an average stranger',
          15: 'Trick an average merchant',
          20: 'Trick a trained courtier',
          25: 'Trick a spymaster',
          30: 'Trick a god',
        },
      },
    ],
  },
  Knowledge: {
    trait: 'Knowledge',
    description: 'Education, memory, analysis, and learning ability',
    verbs: ['Recall', 'Analyze', 'Comprehend', 'Research', 'Deduce'],
    actions: [
      {
        action: 'Recall',
        examples: {
          5: 'Recall uncommon facts about your community',
          10: 'Recall uncommon facts about a neighboring community',
          15: 'Recall uncommon facts about a distant community',
          20: 'Recall specialized facts about a distant community',
          25: 'Recall specialized facts about a fallen kingdom',
          30: 'Recall secret information about an obscure historical group',
        },
      },
      {
        action: 'Analyze',
        examples: {
          5: 'Unpack an obvious metaphor in a simple text',
          10: 'Identify obvious subtext in a conversation',
          15: 'Break an average cipher in a coded message',
          20: 'Identify a weakness in a complicated battle plan',
          25: 'Predict the downfall of a nation based on concealed misdeeds',
          30: "Identify the weakness in a divine champion's fighting form",
        },
      },
      {
        action: 'Comprehend',
        examples: {
          5: 'Learn simple skills from an excellent teacher',
          10: 'Learn simple skills from an average teacher',
          15: 'Learn complicated skills from an excellent teacher',
          20: 'Learn complicated skills under poor conditions',
          25: 'Learn complicated skills quickly under dangerous conditions',
          30: 'Learn complicated skills quickly from incomplete information',
        },
      },
    ],
  },
};

/** @deprecated Use TRAIT_DIFFICULTY_GUIDANCE directly */
export const TRAIT_GUIDANCE_BY_NAME = TRAIT_DIFFICULTY_GUIDANCE;

// ---------------------------------------------------------------------------
// Quick Reference Helpers
// ---------------------------------------------------------------------------

/**
 * Get example text for a specific trait, action, and difficulty level
 */
export function getTraitExample(
  trait: TraitName,
  action: string,
  difficulty: number
): string | undefined {
  const guidance = TRAIT_GUIDANCE_BY_NAME[trait];
  if (!guidance) return undefined;

  const actionData = guidance.actions.find(
    a => a.action.toLowerCase() === action.toLowerCase()
  );
  if (!actionData) return undefined;

  return actionData.examples[difficulty];
}

/**
 * Get all examples for a given difficulty level across all traits
 */
export function getExamplesAtDifficulty(
  difficulty: number
): Array<{ trait: TraitName; action: string; example: string }> {
  const results: Array<{ trait: TraitName; action: string; example: string }> =
    [];

  for (const guidance of Object.values(TRAIT_DIFFICULTY_GUIDANCE)) {
    for (const action of guidance.actions) {
      const example = action.examples[difficulty];
      if (example) {
        results.push({
          trait: guidance.trait,
          action: action.action,
          example,
        });
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// GM Quick Reference Summary
// ---------------------------------------------------------------------------

export interface DifficultyQuickRef {
  value: number;
  name: string;
  shortDescription: string;
  exampleActions: string[];
}

/**
 * Condensed quick reference for GMs, combining the levels with sample actions
 */
export const DIFFICULTY_QUICK_REFERENCE: DifficultyQuickRef[] = [
  {
    value: 5,
    name: 'Very Easy',
    shortDescription: 'Almost automatic success',
    exampleActions: [
      'Lift a chair (Strength)',
      'Trick a trusting acquaintance (Presence)',
      'Hear a loud noise nearby (Instinct)',
    ],
  },
  {
    value: 10,
    name: 'Easy',
    shortDescription: 'Most characters succeed',
    exampleActions: [
      'Sprint across an open field (Agility)',
      'Subdue a weak adult (Strength)',
      'Open a simple puzzle box (Finesse)',
    ],
  },
  {
    value: 15,
    name: 'Average',
    shortDescription: 'Fair challenge requiring skill',
    exampleActions: [
      'Break through a wooden door (Strength)',
      'Disable a standard trap (Finesse)',
      "See through a merchant's lies (Instinct)",
    ],
  },
  {
    value: 20,
    name: 'Hard',
    shortDescription: 'Skilled characters needed',
    exampleActions: [
      'Jump three times your height (Agility)',
      'Break through a stone wall (Strength)',
      "Bypass an enemy's party (Presence)",
    ],
  },
  {
    value: 25,
    name: 'Very Hard',
    shortDescription: 'Exceptional effort required',
    exampleActions: [
      'Sprint through a pitched battle (Agility)',
      'Subdue a large beast (Strength)',
      'Turn an enemy against their ruler (Presence)',
    ],
  },
  {
    value: 30,
    name: 'Nearly Impossible',
    shortDescription: 'Heroic feat',
    exampleActions: [
      "Break a god's grip (Strength)",
      'Trick a god (Presence)',
      "Navigate a trickster god's maze (Instinct)",
    ],
  },
];
