import { countByType } from '@/features/characters/logic';
import type { DomainCard } from '@/lib/schemas/domains';
import { cn } from '@/lib/utils';

export function TypeSummaryChips({ items }: { items: DomainCard[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {countByType(items).map(({ type, count }) => (
        <span
          key={type}
          className={cn(
            'rounded px-2 py-0.5',
            type === 'Spell'
              ? 'bg-blue-100 text-blue-900 dark:bg-blue-500/20 dark:text-blue-200'
              : 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200'
          )}
        >
          {type} {count}
        </span>
      ))}
    </div>
  );
}
