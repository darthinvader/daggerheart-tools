import type { DamageType } from './types';

export const DAMAGE_TYPES: {
  value: DamageType;
  label: string;
  icon: string;
}[] = [
  { value: 'physical', label: 'Physical', icon: '⚔️' },
  { value: 'magic', label: 'Magic', icon: '✨' },
];

export const SEVERITY_LEVELS = [
  {
    name: 'Minor',
    threshold: 'minor',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  {
    name: 'Major',
    threshold: 'major',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    name: 'Severe',
    threshold: 'severe',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
] as const;
