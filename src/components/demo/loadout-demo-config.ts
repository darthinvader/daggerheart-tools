export const DEMO_CONFIGS = {
  '1': {
    label: 'Tier 1 (Lv 1)',
    emoji: '🌱',
    domains: ['Blade', 'Bone'] as const,
    description: 'New adventurer with basic domain cards (Level 1)',
  },
  '2-4': {
    label: 'Tier 2 (Lv 2-4)',
    emoji: '⚔️',
    domains: ['Arcana', 'Codex'] as const,
    description: 'Seasoned adventurer with intermediate cards (Levels 1-4)',
  },
  '5-7': {
    label: 'Tier 3 (Lv 5-7)',
    emoji: '🔥',
    domains: ['Midnight', 'Sage'] as const,
    description: 'Veteran hero with advanced cards (Levels 1-7)',
  },
  '8-10': {
    label: 'Tier 4 (Lv 8-10)',
    emoji: '👑',
    domains: ['Splendor', 'Valor'] as const,
    description: 'Legendary champion with all cards (Levels 1-10)',
  },
} as const;

export type DemoTier = keyof typeof DEMO_CONFIGS;
