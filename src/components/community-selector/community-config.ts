import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';
import { CommunityIcons, Home } from '@/lib/icons';

type IconComponent = ComponentType<LucideProps>;

export const COMMUNITY_COLORS: Record<
  string,
  { border: string; bg: string; text: string; accent: string }
> = {
  Highborne: {
    border: 'border-yellow-300 dark:border-yellow-700',
    bg: 'bg-yellow-50 dark:bg-yellow-950/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    accent: 'text-yellow-900 dark:text-yellow-200',
  },
  Loreborne: {
    border: 'border-indigo-300 dark:border-indigo-700',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
    text: 'text-indigo-700 dark:text-indigo-400',
    accent: 'text-indigo-900 dark:text-indigo-200',
  },
  Orderborne: {
    border: 'border-slate-300 dark:border-slate-600',
    bg: 'bg-slate-50 dark:bg-slate-900/30',
    text: 'text-slate-700 dark:text-slate-400',
    accent: 'text-slate-900 dark:text-slate-200',
  },
  Ridgeborne: {
    border: 'border-stone-300 dark:border-stone-600',
    bg: 'bg-stone-50 dark:bg-stone-900/30',
    text: 'text-stone-700 dark:text-stone-400',
    accent: 'text-stone-900 dark:text-stone-200',
  },
  Seaborne: {
    border: 'border-cyan-300 dark:border-cyan-700',
    bg: 'bg-cyan-50 dark:bg-cyan-950/30',
    text: 'text-cyan-700 dark:text-cyan-400',
    accent: 'text-cyan-900 dark:text-cyan-200',
  },
  Slyborne: {
    border: 'border-red-300 dark:border-red-800',
    bg: 'bg-red-50 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-400',
    accent: 'text-red-900 dark:text-red-200',
  },
  Underborne: {
    border: 'border-purple-300 dark:border-purple-800',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    text: 'text-purple-700 dark:text-purple-400',
    accent: 'text-purple-900 dark:text-purple-200',
  },
  Wanderborne: {
    border: 'border-orange-300 dark:border-orange-700',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-700 dark:text-orange-400',
    accent: 'text-orange-900 dark:text-orange-200',
  },
  Wildborne: {
    border: 'border-green-300 dark:border-green-700',
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-400',
    accent: 'text-green-900 dark:text-green-200',
  },
};

export function getCommunityIcon(name: string): IconComponent {
  return CommunityIcons[name] ?? Home;
}

export function getCommunityColors(name: string) {
  return (
    COMMUNITY_COLORS[name] ?? {
      border: 'border-border',
      bg: 'bg-card',
      text: 'text-foreground',
      accent: 'text-muted-foreground',
    }
  );
}
