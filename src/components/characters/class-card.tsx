import { ClassSummary } from '@/components/characters/class-summary';
import { FeaturesList } from '@/components/characters/features-list';
import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
// Title becomes tappable; no separate header icon
import { Card, CardContent } from '@/components/ui/card';
import type { FeatureView } from '@/features/characters/logic';

export type ClassCardProps = {
  selectedClass?: string;
  selectedSubclass?: string;
  onEdit?: () => void;
  // Combined Class Features display inside the Class section
  level?: number;
  features?: FeatureView[];
  selections?: Record<string, string | number | boolean>;
};

export function ClassCard({
  selectedClass,
  selectedSubclass,
  onEdit,
  level = 1,
  features = [],
  selections,
}: ClassCardProps) {
  const isInteractive = (t: EventTarget | null) => {
    if (!(t instanceof HTMLElement)) return false;
    return !!t.closest(
      'button, a, input, textarea, select, [role="button"], [role="link"], [contenteditable="true"], [data-no-open]'
    );
  };
  return (
    <Card>
      <CharacterCardHeader
        title="Class & Subclass"
        subtitle="Tap title or section to edit"
        titleClassName="text-lg sm:text-xl"
        onTitleClick={onEdit}
      />
      <CardContent
        role={onEdit ? 'button' : undefined}
        tabIndex={onEdit ? 0 : undefined}
        onClick={e => {
          if (!onEdit || isInteractive(e.target)) return;
          onEdit();
        }}
        onKeyDown={e => {
          if (!onEdit || isInteractive(e.target)) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEdit();
          }
        }}
        className={
          onEdit
            ? 'hover:bg-accent/30 focus-visible:ring-ring cursor-pointer rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none'
            : undefined
        }
      >
        <div className="min-w-0 text-sm">
          <ClassSummary className={selectedClass} subclass={selectedSubclass} />
        </div>
        {/* Features displayed inside Class section */}
        <div className="mt-4">
          <FeaturesList
            level={level}
            features={features}
            selections={selections}
          />
        </div>
      </CardContent>
    </Card>
  );
}
