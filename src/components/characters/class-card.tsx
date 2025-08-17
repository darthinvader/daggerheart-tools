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
  return (
    <Card>
      <CharacterCardHeader
        title="Class & Subclass"
        subtitle="Tap the title to edit"
        titleClassName="text-lg sm:text-xl"
        onTitleClick={onEdit}
      />
      <CardContent>
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
