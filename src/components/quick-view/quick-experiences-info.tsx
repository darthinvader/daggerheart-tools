import type { ExperiencesState } from '@/components/experiences';
import { Library } from '@/lib/icons';
import { cn } from '@/lib/utils';

interface QuickExperiencesInfoProps {
  experiences: ExperiencesState;
  className?: string;
}

export function QuickExperiencesInfo({
  experiences,
  className,
}: QuickExperiencesInfoProps) {
  const items = experiences?.items ?? [];

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn('bg-card rounded-lg border p-2 sm:p-3', className)}>
      <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
        <Library className="size-4 sm:size-5" />
        <span className="text-sm font-semibold sm:text-base">Experiences</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 text-xs sm:grid-cols-3 sm:gap-2 sm:text-sm">
        {items.map(exp => (
          <div
            key={exp.id}
            className="flex items-center justify-between rounded border px-2 py-1"
          >
            <span className="truncate font-medium">{exp.name}</span>
            <span className="text-primary ml-1 shrink-0 text-xs font-semibold">
              +{exp.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
