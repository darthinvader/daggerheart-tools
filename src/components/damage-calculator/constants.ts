import type { LucideIcon } from 'lucide-react';

import { DamageTypeIcons } from '@/lib/icons';

import type { DamageType } from './types';

export const DAMAGE_TYPES: {
  value: DamageType;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: 'physical', label: 'Physical', icon: DamageTypeIcons.physical },
  { value: 'magic', label: 'Magic', icon: DamageTypeIcons.magic },
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
  {
    name: 'Critical',
    threshold: 'critical',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
] as const;
