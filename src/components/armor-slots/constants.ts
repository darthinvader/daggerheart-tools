import type { ArmorSlotState } from './types';

export const ARMOR_SLOT_STYLES: Record<
  ArmorSlotState,
  { bg: string; border: string; icon: string; label: string }
> = {
  available: {
    bg: 'bg-slate-500',
    border: 'border-slate-500',
    icon: '🛡️',
    label: 'Available',
  },
  used: {
    bg: 'bg-amber-500',
    border: 'border-amber-500',
    icon: '⚡',
    label: 'Used (absorbing damage)',
  },
  damaged: {
    bg: 'bg-orange-500/50',
    border: 'border-orange-500',
    icon: '⚠️',
    label: 'Damaged (needs repair)',
  },
  broken: {
    bg: 'bg-red-500/30',
    border: 'border-red-500',
    icon: '❌',
    label: 'Broken (destroyed)',
  },
};
