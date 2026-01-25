import type { RulesTag } from '@/lib/data/rules/rules-content';

export function tagToneClasses(tone?: RulesTag['tone']) {
  switch (tone) {
    case 'success':
      return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    case 'warning':
      return 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300';
    default:
      return 'border-border bg-muted/40 text-foreground';
  }
}
