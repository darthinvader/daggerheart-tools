import type { LucideIcon } from 'lucide-react';
import { Heart, HeartCrack, Shield } from 'lucide-react';

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

export const RESOURCE_CONFIG: {
  key: keyof ResourcesState;
  label: string;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    key: 'hp' as const,
    label: 'Hit Points',
    icon: Heart,
    color: 'text-red-500',
  },
  {
    key: 'stress' as const,
    label: 'Stress',
    icon: HeartCrack,
    color: 'text-yellow-500',
  },
  {
    key: 'armorScore' as const,
    label: 'Armor Score',
    icon: Shield,
    color: 'text-slate-500',
  },
];
