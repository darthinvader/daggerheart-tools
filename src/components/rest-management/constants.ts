import type { LucideIcon } from 'lucide-react';

import { RestIcons } from '@/lib/icons';

import type { RestType } from './types';

export const REST_CONFIG: Record<
  RestType,
  {
    label: string;
    description: string;
    icon: LucideIcon;
    duration: string;
    effects: string[];
  }
> = {
  short: {
    label: 'Short Rest',
    description: 'A brief respite to catch your breath',
    icon: RestIcons.short,
    duration: '~10-30 minutes',
    effects: [
      'Spend Hope to recover Hit Points (1 Hope = 1d6 HP)',
      'Clear 1 Stress (once per rest)',
      'Repair armor with a successful roll',
    ],
  },
  long: {
    label: 'Long Rest',
    description: 'An extended period of rest and recovery',
    icon: RestIcons.long,
    duration: '6-8 hours',
    effects: [
      'Recover all Hit Points',
      'Clear all Stress',
      'Fully repair all armor',
      'Recover Hope to maximum',
      'Opportunity for downtime moves',
    ],
  },
};
