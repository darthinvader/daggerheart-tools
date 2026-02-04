/**
 * SRD-compliant rest moves.
 * Per SRD v1.0 (Page 41): Short rest and long rest move options.
 */
import type { RestMove } from './types';

/** Short rest moves - recovery is 1d4+Tier */
export const SHORT_REST_MOVES: RestMove[] = [
  {
    id: 'tend-wounds-short',
    name: 'Tend to Wounds',
    description: 'Clear 1d4+Tier Hit Points for yourself or an ally.',
    category: 'healing',
    shortRest: true,
    longRest: false,
    isFullClear: false,
    canTargetAlly: true,
  },
  {
    id: 'clear-stress-short',
    name: 'Clear Stress',
    description: 'Clear 1d4+Tier Stress.',
    category: 'stress',
    shortRest: true,
    longRest: false,
    isFullClear: false,
    canTargetAlly: false,
  },
  {
    id: 'repair-armor-short',
    name: 'Repair Armor',
    description: "Clear 1d4+Tier Armor Slots from your or an ally's armor.",
    category: 'armor',
    shortRest: true,
    longRest: false,
    isFullClear: false,
    canTargetAlly: true,
  },
  {
    id: 'prepare',
    name: 'Prepare',
    description:
      'Describe how you prepare yourself for the path ahead, then gain a Hope. If you choose to Prepare with one or more members of your party, you each gain 2 Hope.',
    category: 'hope',
    shortRest: true,
    longRest: true,
    isFullClear: false,
    canTargetAlly: false,
  },
];

/** Long rest moves - full recovery */
export const LONG_REST_MOVES: RestMove[] = [
  {
    id: 'tend-wounds-long',
    name: 'Tend to All Wounds',
    description: 'Clear all Hit Points for yourself or an ally.',
    category: 'healing',
    shortRest: false,
    longRest: true,
    isFullClear: true,
    canTargetAlly: true,
  },
  {
    id: 'clear-stress-long',
    name: 'Clear All Stress',
    description: 'Clear all Stress.',
    category: 'stress',
    shortRest: false,
    longRest: true,
    isFullClear: true,
    canTargetAlly: false,
  },
  {
    id: 'repair-armor-long',
    name: 'Repair All Armor',
    description: "Clear all Armor Slots from your or an ally's armor.",
    category: 'armor',
    shortRest: false,
    longRest: true,
    isFullClear: true,
    canTargetAlly: true,
  },
  {
    id: 'prepare',
    name: 'Prepare',
    description:
      "Describe how you prepare for the next day's adventure, then gain a Hope. If you choose to Prepare with one or more members of your party, you each gain 2 Hope.",
    category: 'hope',
    shortRest: true,
    longRest: true,
    isFullClear: false,
    canTargetAlly: false,
  },
  {
    id: 'work-on-project',
    name: 'Work on a Project',
    description:
      "With GM approval, pursue a long-term project such as deciphering an ancient text or crafting a new weapon. Advance the project's countdown.",
    category: 'project',
    shortRest: false,
    longRest: true,
    isFullClear: false,
    canTargetAlly: false,
  },
];

/**
 * Get available moves for a rest type.
 */
export function getMovesForRestType(restType: 'short' | 'long'): RestMove[] {
  if (restType === 'short') {
    return SHORT_REST_MOVES;
  }
  return LONG_REST_MOVES;
}

/**
 * Category labels for display.
 */
export const REST_MOVE_CATEGORY_LABELS: Record<string, string> = {
  healing: 'Recovery',
  stress: 'Mental',
  armor: 'Equipment',
  hope: 'Preparation',
  project: 'Projects',
};

/**
 * Category icons (emoji) for display.
 */
export const REST_MOVE_CATEGORY_ICONS: Record<string, string> = {
  healing: '❤️',
  stress: '🧠',
  armor: '🛡️',
  hope: '✨',
  project: '📜',
};
