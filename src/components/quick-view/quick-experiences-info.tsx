import type { ExperiencesState } from '@/components/experiences';
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
    <div className={cn('bg-card rounded-lg border p-3', className)}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">📚</span>
        <span className="font-semibold">Experiences</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
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
