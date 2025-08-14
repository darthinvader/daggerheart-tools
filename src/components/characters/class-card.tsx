import { ClassSummary } from '@/components/characters/class-summary';
import { FeaturesList } from '@/components/characters/features-list';
import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { FeatureView } from '@/features/characters/logic';

export type ClassCardProps = {
  selectedClass?: string;
  selectedSubclass?: string;
  onEdit?: () => void;
  disabled?: boolean;
  // Combined Class Features display inside the Class section
  level?: number;
  features?: FeatureView[];
  selections?: Record<string, string | number | boolean>;
};

export function ClassCard({
  selectedClass,
  selectedSubclass,
  onEdit,
  disabled = false,
  level = 1,
  features = [],
  selections,
}: ClassCardProps) {
  return (
    <Card>
      <CharacterCardHeader
        title="Class & Subclass"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            disabled={disabled}
          >
            Edit
          </Button>
        }
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
