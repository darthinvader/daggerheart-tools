import type { LucideIcon } from 'lucide-react';

import { ArmorStateIcons } from '@/lib/icons';

import type { ArmorSlotState } from './types';

export const ARMOR_SLOT_STYLES: Record<
  ArmorSlotState,
  { bg: string; border: string; icon: LucideIcon; label: string }
> = {
  available: {
    bg: 'bg-slate-500',
    border: 'border-slate-500',
    icon: ArmorStateIcons.available,
    label: 'Available',
  },
  used: {
    bg: 'bg-amber-500',
    border: 'border-amber-500',
    icon: ArmorStateIcons.used,
    label: 'Used (absorbing damage)',
  },
  damaged: {
    bg: 'bg-orange-500/50',
    border: 'border-orange-500',
    icon: ArmorStateIcons.damaged,
    label: 'Damaged (needs repair)',
  },
  broken: {
    bg: 'bg-red-500/30',
    border: 'border-red-500',
    icon: ArmorStateIcons.broken,
    label: 'Broken (destroyed)',
  },
};
