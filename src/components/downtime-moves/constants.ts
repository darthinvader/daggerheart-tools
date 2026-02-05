import type { LucideIcon } from 'lucide-react';

import { DowntimeMoveIcons } from '@/lib/icons';

import type { DowntimeCategory, DowntimeMove } from './types';

export const DOWNTIME_CATEGORIES: {
  value: DowntimeCategory;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: 'recovery', label: 'Recovery', icon: DowntimeMoveIcons.recovery },
  { value: 'crafting', label: 'Crafting', icon: DowntimeMoveIcons.crafting },
  { value: 'social', label: 'Social', icon: DowntimeMoveIcons.social },
  {
    value: 'exploration',
    label: 'Exploration',
    icon: DowntimeMoveIcons.exploration,
  },
  { value: 'training', label: 'Training', icon: DowntimeMoveIcons.training },
];

export const STANDARD_DOWNTIME_MOVES: DowntimeMove[] = [
  {
    id: 'rest-recover',
    name: 'Rest and Recover',
    description:
      'Take time to heal wounds and clear stress. Recover additional HP equal to your Proficiency and clear 1 additional Stress.',
    category: 'recovery',
    defaultHoursRequired: 4,
  },
  {
    id: 'craft-item',
    name: 'Craft an Item',
    description:
      'Spend time creating equipment, potions, or other useful items using appropriate materials and skills.',
    category: 'crafting',
    defaultHoursRequired: 8,
  },
  {
    id: 'gather-information',
    name: 'Gather Information',
    description:
      'Speak with locals, research in libraries, or otherwise learn about the area, people, or upcoming challenges.',
    category: 'social',
    defaultHoursRequired: 2,
  },
  {
    id: 'make-connections',
    name: 'Make Connections',
    description:
      'Build relationships with NPCs, join organizations, or establish useful contacts for future adventures.',
    category: 'social',
    defaultHoursRequired: 4,
  },
  {
    id: 'explore-area',
    name: 'Explore the Area',
    description:
      'Scout the surroundings, map locations, or discover hidden places of interest.',
    category: 'exploration',
    defaultHoursRequired: 4,
  },
  {
    id: 'train-skill',
    name: 'Train a Skill',
    description:
      'Practice combat techniques, study magic, or otherwise improve your abilities through dedicated training.',
    category: 'training',
    defaultHoursRequired: 8,
  },
  {
    id: 'work-for-gold',
    name: 'Work for Gold',
    description:
      'Take on odd jobs or use your skills to earn gold during downtime.',
    category: 'social',
    defaultHoursRequired: 8,
  },
  {
    id: 'tend-wounds',
    name: 'Tend to Wounds',
    description:
      'Use medical knowledge or magic to help heal yourself or allies more effectively.',
    category: 'recovery',
    defaultHoursRequired: 2,
  },
];

export const DOWNTIME_CATEGORY_MAP = Object.fromEntries(
  DOWNTIME_CATEGORIES.map(c => [c.value, c])
) as Record<DowntimeCategory, (typeof DOWNTIME_CATEGORIES)[number]>;

// =====================================================================================
// Domain-Specific Downtime Moves
// =====================================================================================

export const DOMAIN_DOWNTIME_MOVES: DowntimeMove[] = [
  // Arcana Domain
  {
    id: 'arcana-attune-leylines',
    name: 'Attune to Leylines',
    description:
      'Meditate on the magical currents flowing through the area. On your next Spellcast roll, you may reroll one die.',
    category: 'training',
    defaultHoursRequired: 4,
    requiredDomain: 'Arcana',
    flavorText: 'The Arcana domain teaches mastery over raw magical energies.',
  },
  {
    id: 'arcana-study-phenomena',
    name: 'Study Magical Phenomena',
    description:
      'Investigate unusual magical occurrences in the area. Gain advantage on Knowledge rolls about magical effects until your next rest.',
    category: 'exploration',
    defaultHoursRequired: 4,
    requiredDomain: 'Arcana',
  },

  // Blade Domain
  {
    id: 'blade-sharpen-edge',
    name: 'Hone Your Edge',
    description:
      'Practice precise weapon techniques. Your next successful attack with a bladed weapon deals +2 damage.',
    category: 'training',
    defaultHoursRequired: 4,
    requiredDomain: 'Blade',
    flavorText: 'The Blade domain masters the art of sharp steel.',
  },
  {
    id: 'blade-weapon-care',
    name: 'Care for Weapons',
    description:
      'Maintain and improve your weapons. Clear 1 Armor Slot from any equipment you carry.',
    category: 'crafting',
    defaultHoursRequired: 2,
    requiredDomain: 'Blade',
  },

  // Bone Domain
  {
    id: 'bone-commune-dead',
    name: 'Commune with the Dead',
    description:
      'Seek wisdom from spirits that linger nearby. Ask the GM one question about a deceased person or the history of a location.',
    category: 'social',
    defaultHoursRequired: 4,
    requiredDomain: 'Bone',
    flavorText: 'The Bone domain bridges the gap between life and death.',
  },
  {
    id: 'bone-study-mortality',
    name: 'Study Mortality',
    description:
      'Contemplate the cycle of life and death. The next time you would mark your last HP, roll a d6. On 5+, mark a Stress instead.',
    category: 'recovery',
    defaultHoursRequired: 4,
    requiredDomain: 'Bone',
  },

  // Codex Domain
  {
    id: 'codex-research-lore',
    name: 'Research Ancient Lore',
    description:
      'Study texts, scrolls, or oral histories. Gain a +2 bonus to your next Knowledge roll related to history, creatures, or magic.',
    category: 'exploration',
    defaultHoursRequired: 4,
    requiredDomain: 'Codex',
    flavorText: 'The Codex domain preserves and unlocks ancient knowledge.',
  },
  {
    id: 'codex-inscribe-knowledge',
    name: 'Inscribe Knowledge',
    description:
      'Document your discoveries and experiences. You or an ally can spend a Hope to recall this information perfectly later.',
    category: 'crafting',
    defaultHoursRequired: 2,
    requiredDomain: 'Codex',
  },

  // Grace Domain
  {
    id: 'grace-inspire-others',
    name: 'Inspire Through Grace',
    description:
      'Perform acts of kindness and beauty. One ally clears 2 Stress and gains 1 Hope.',
    category: 'social',
    defaultHoursRequired: 2,
    requiredDomain: 'Grace',
    flavorText:
      'The Grace domain embodies elegance, compassion, and inspiration.',
  },
  {
    id: 'grace-practice-poise',
    name: 'Practice Poise',
    description:
      'Refine your movements and bearing. Gain advantage on your next Presence or Agility roll.',
    category: 'training',
    defaultHoursRequired: 4,
    requiredDomain: 'Grace',
  },

  // Midnight Domain
  {
    id: 'midnight-case-shadows',
    name: 'Case the Shadows',
    description:
      'Scout locations under cover of darkness. Learn the patrol patterns, hidden entrances, or secrets of a building or area.',
    category: 'exploration',
    defaultHoursRequired: 4,
    requiredDomain: 'Midnight',
    flavorText: 'The Midnight domain thrives in darkness and secrecy.',
  },
  {
    id: 'midnight-establish-network',
    name: 'Establish Shadow Network',
    description:
      'Connect with the criminal underworld or informants. Gain a contact who can provide information or services (GM determines details).',
    category: 'social',
    defaultHoursRequired: 8,
    requiredDomain: 'Midnight',
  },

  // Sage Domain
  {
    id: 'sage-meditative-insight',
    name: 'Seek Meditative Insight',
    description:
      'Enter deep meditation to gain clarity. Ask the GM one yes/no question about your current situation or path.',
    category: 'recovery',
    defaultHoursRequired: 4,
    requiredDomain: 'Sage',
    flavorText: 'The Sage domain pursues wisdom through contemplation.',
  },
  {
    id: 'sage-teach-wisdom',
    name: 'Share Wisdom',
    description:
      'Guide an ally through reflection. That ally gains a +1 bonus to one trait roll of their choice before the next rest.',
    category: 'social',
    defaultHoursRequired: 2,
    requiredDomain: 'Sage',
  },

  // Splendor Domain
  {
    id: 'splendor-dazzle-crowds',
    name: 'Dazzle the Crowds',
    description:
      'Perform, display wealth, or demonstrate magnificence. Gain advantage on your next Presence roll with NPCs who witnessed you.',
    category: 'social',
    defaultHoursRequired: 2,
    requiredDomain: 'Splendor',
    flavorText: 'The Splendor domain commands attention through spectacle.',
  },
  {
    id: 'splendor-acquire-finery',
    name: 'Acquire Finery',
    description:
      'Obtain impressive clothing, jewelry, or accessories. You appear wealthy and influential until your next long rest.',
    category: 'crafting',
    defaultHoursRequired: 4,
    requiredDomain: 'Splendor',
  },

  // Valor Domain
  {
    id: 'valor-rally-spirits',
    name: 'Rally Spirits',
    description:
      'Give a rousing speech or lead by example. All allies clear 1 Stress.',
    category: 'social',
    defaultHoursRequired: 2,
    requiredDomain: 'Valor',
    flavorText: 'The Valor domain inspires courage and heroism.',
  },
  {
    id: 'valor-battle-drills',
    name: 'Lead Battle Drills',
    description:
      'Train with your companions in combat coordination. The next time you use a Tag Team action, roll an additional d6.',
    category: 'training',
    defaultHoursRequired: 4,
    requiredDomain: 'Valor',
  },
];

// =====================================================================================
// Class-Specific Downtime Moves
// =====================================================================================

export const CLASS_DOWNTIME_MOVES: DowntimeMove[] = [
  // Bard
  {
    id: 'bard-compose-song',
    name: 'Compose a Song',
    description:
      'Create a new performance piece. The next time you use your Rally Die ability, you may reroll it once.',
    category: 'crafting',
    defaultHoursRequired: 4,
    requiredClass: 'Bard',
    flavorText: 'Bards weave magic through melody and story.',
  },
  {
    id: 'bard-gather-stories',
    name: 'Gather Stories',
    description:
      'Listen to local tales and gossip. Learn one rumor or secret about the area, a person, or upcoming events.',
    category: 'social',
    defaultHoursRequired: 2,
    requiredClass: 'Bard',
  },

  // Druid
  {
    id: 'druid-commune-nature',
    name: 'Commune with Nature',
    description:
      'Bond with the natural world around you. Learn the general health of the region and any unnatural disturbances.',
    category: 'exploration',
    defaultHoursRequired: 4,
    requiredClass: 'Druid',
    flavorText: 'Druids speak the language of the wild.',
  },
  {
    id: 'druid-forage-ingredients',
    name: 'Forage for Ingredients',
    description:
      'Search for natural components. Find 1d4 worth of materials usable for crafting potions or salves.',
    category: 'exploration',
    defaultHoursRequired: 4,
    requiredClass: 'Druid',
  },

  // Guardian
  {
    id: 'guardian-fortify-position',
    name: 'Fortify Position',
    description:
      'Prepare defenses at your current location. You and allies gain +2 to Evasion against the first attack in the next combat here.',
    category: 'crafting',
    defaultHoursRequired: 4,
    requiredClass: 'Guardian',
    flavorText: 'Guardians stand as unbreakable shields.',
  },
  {
    id: 'guardian-train-endurance',
    name: 'Train Endurance',
    description:
      'Push your physical limits. The next time you would take Major damage, treat it as Minor instead.',
    category: 'training',
    defaultHoursRequired: 8,
    requiredClass: 'Guardian',
  },

  // Ranger
  {
    id: 'ranger-bond-companion',
    name: 'Bond with Companion',
    description:
      'Spend quality time with your animal companion. Your companion clears all Stress and gains a +1 bonus to their next roll.',
    category: 'recovery',
    defaultHoursRequired: 2,
    requiredClass: 'Ranger',
    flavorText: 'Rangers share an unbreakable bond with their companions.',
  },
  {
    id: 'ranger-scout-terrain',
    name: 'Scout the Terrain',
    description:
      'Survey the surrounding area with expert eyes. Learn the safest routes, potential ambush points, and points of interest.',
    category: 'exploration',
    defaultHoursRequired: 4,
    requiredClass: 'Ranger',
  },

  // Rogue
  {
    id: 'rogue-case-mark',
    name: 'Case Your Mark',
    description:
      'Study a target (person, building, or object). Gain advantage on your next roll to steal from, infiltrate, or deceive regarding this target.',
    category: 'exploration',
    defaultHoursRequired: 4,
    requiredClass: 'Rogue',
    flavorText: 'Rogues plan their moves with cunning precision.',
  },
  {
    id: 'rogue-fence-goods',
    name: 'Fence Goods',
    description:
      'Sell stolen or questionable items through back channels. Convert unwanted items to gold at a reduced rate without drawing attention.',
    category: 'social',
    defaultHoursRequired: 4,
    requiredClass: 'Rogue',
  },

  // Seraph
  {
    id: 'seraph-divine-meditation',
    name: 'Divine Meditation',
    description:
      'Connect with your divine source. Ask your deity or patron one question and receive guidance (GM provides a cryptic answer).',
    category: 'recovery',
    defaultHoursRequired: 4,
    requiredClass: 'Seraph',
    flavorText: 'Seraphs channel the power of the divine.',
  },
  {
    id: 'seraph-bless-ground',
    name: 'Bless the Ground',
    description:
      'Consecrate an area with divine energy. Allies who rest here clear an additional Stress.',
    category: 'recovery',
    defaultHoursRequired: 2,
    requiredClass: 'Seraph',
  },

  // Sorcerer
  {
    id: 'sorcerer-channel-essence',
    name: 'Channel Your Essence',
    description:
      'Let your innate magic flow freely. Gain a +1 bonus to your Spellcast trait until your next rest.',
    category: 'training',
    defaultHoursRequired: 4,
    requiredClass: 'Sorcerer',
    flavorText: 'Sorcerers wield magic born from within.',
  },
  {
    id: 'sorcerer-sense-magic',
    name: 'Sense Magical Auras',
    description:
      'Extend your magical awareness. Detect all magical items, creatures, or effects within Close range.',
    category: 'exploration',
    defaultHoursRequired: 2,
    requiredClass: 'Sorcerer',
  },

  // Warrior
  {
    id: 'warrior-war-stories',
    name: 'Share War Stories',
    description:
      'Recount battles and victories. You and allies who listen gain 1 Hope.',
    category: 'social',
    defaultHoursRequired: 2,
    requiredClass: 'Warrior',
    flavorText: 'Warriors inspire through deeds and valor.',
  },
  {
    id: 'warrior-weapon-mastery',
    name: 'Practice Weapon Mastery',
    description:
      'Drill with your weapons of choice. Your next attack roll gains a +2 bonus.',
    category: 'training',
    defaultHoursRequired: 4,
    requiredClass: 'Warrior',
  },

  // Wizard
  {
    id: 'wizard-study-spells',
    name: 'Study Your Spellbook',
    description:
      'Review and practice your magical knowledge. Choose one spell in your vault; reduce its Recall Cost by 1 (minimum 1) until your next long rest.',
    category: 'training',
    defaultHoursRequired: 4,
    requiredClass: 'Wizard',
    flavorText: 'Wizards master magic through dedicated study.',
  },
  {
    id: 'wizard-transcribe-scroll',
    name: 'Transcribe a Scroll',
    description:
      'Copy a spell to a temporary scroll. You or an ally can cast this spell once without spending Hope.',
    category: 'crafting',
    defaultHoursRequired: 8,
    requiredClass: 'Wizard',
  },
];

// Combined list of all downtime moves
export const ALL_DOWNTIME_MOVES: DowntimeMove[] = [
  ...STANDARD_DOWNTIME_MOVES,
  ...DOMAIN_DOWNTIME_MOVES,
  ...CLASS_DOWNTIME_MOVES,
];
