import type { DomainCard } from '@/lib/schemas/domains';

// Centralized emoji + color per domain (matches DomainNameEnum). Unknowns fall back by type.
export const domainMap: Record<
  string,
  { emoji: string; border: string; chip: string }
> = {
  Arcana: {
    emoji: '🪄',
    border: 'border-indigo-500/80',
    chip: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-200',
  },
  Blade: {
    emoji: '🗡️',
    border: 'border-rose-500/80',
    chip: 'bg-rose-100 text-rose-900 dark:bg-rose-500/20 dark:text-rose-200',
  },
  Bone: {
    emoji: '💀',
    border: 'border-zinc-500/80',
    chip: 'bg-zinc-100 text-zinc-900 dark:bg-zinc-500/20 dark:text-zinc-200',
  },
  Codex: {
    emoji: '📜',
    border: 'border-sky-500/80',
    chip: 'bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-200',
  },
  Grace: {
    emoji: '🕊️',
    border: 'border-fuchsia-500/80',
    chip: 'bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-500/20 dark:text-fuchsia-200',
  },
  Midnight: {
    emoji: '🌑',
    border: 'border-slate-500/80',
    chip: 'bg-slate-100 text-slate-900 dark:bg-slate-500/20 dark:text-slate-200',
  },
  Sage: {
    emoji: '🧠',
    border: 'border-emerald-600/80',
    chip: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200',
  },
  Splendor: {
    emoji: '✨',
    border: 'border-amber-500/80',
    chip: 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200',
  },
  Valor: {
    emoji: '🛡️',
    border: 'border-orange-500/80',
    chip: 'bg-orange-100 text-orange-900 dark:bg-orange-500/20 dark:text-orange-200',
  },
  // Present for completeness (no cards yet in data)
  Chaos: {
    emoji: '🌀',
    border: 'border-violet-500/80',
    chip: 'bg-violet-100 text-violet-900 dark:bg-violet-500/20 dark:text-violet-200',
  },
  Moon: {
    emoji: '🌙',
    border: 'border-blue-500/80',
    chip: 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-200',
  },
  Sun: {
    emoji: '☀️',
    border: 'border-yellow-500/80',
    chip: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-200',
  },
  Blood: {
    emoji: '🩸',
    border: 'border-red-500/80',
    chip: 'bg-red-100 text-red-900 dark:bg-red-500/20 dark:text-red-200',
  },
  Fate: {
    emoji: '🧵',
    border: 'border-teal-500/80',
    chip: 'bg-teal-100 text-teal-900 dark:bg-teal-500/20 dark:text-teal-200',
  },
};

export function getAccent(card: DomainCard) {
  const domainKey = String(card.domain);
  const themed = domainMap[domainKey];
  if (themed) {
    return {
      emoji: themed.emoji,
      borderClass: themed.border,
      domainChip: themed.chip,
    } as const;
  }
  const isAbility = String(card.type) === 'Ability';
  return {
    emoji: isAbility ? '✨' : '📜',
    borderClass: isAbility ? 'border-amber-500/80' : 'border-blue-500/80',
    domainChip: 'bg-muted',
  } as const;
}
