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
    <div className={cn('quick-experiences-card', className)}>
      <div className="quick-experiences-grid">
        {items.map(exp => (
          <div key={exp.id} className="quick-experience-item">
            <span className="quick-experience-name">{exp.name}</span>
            <span className="quick-experience-bonus">+{exp.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
