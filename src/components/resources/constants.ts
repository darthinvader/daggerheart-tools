import type { ResourcesState } from './resources-display';

export const DEFAULT_RESOURCES_STATE: ResourcesState = {
  hp: { current: 10, max: 10 },
  stress: { current: 0, max: 6 },
  hope: { current: 2, max: 6 },
  armorScore: { current: 0, max: 0 },
  autoCalculateHp: true,
  autoCalculateEvasion: true,
  autoCalculateArmorScore: true,
  autoCalculateThresholds: true,
};

export const RESOURCE_CONFIG = [
  {
    key: 'hp' as const,
    label: 'Hit Points',
    emoji: '❤️',
    color: 'text-red-500',
  },
  {
    key: 'stress' as const,
    label: 'Stress',
    emoji: '😰',
    color: 'text-yellow-500',
  },
  {
    key: 'armorScore' as const,
    label: 'Armor Score',
    emoji: '🛡️',
    color: 'text-slate-500',
  },
];
