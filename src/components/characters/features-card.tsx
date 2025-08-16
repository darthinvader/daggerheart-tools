import { FeaturesList } from '@/components/characters/features-list';
import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
// Title becomes tappable; no separate header icon
import { Card, CardContent } from '@/components/ui/card';
import type { FeatureView } from '@/features/characters/logic';

export type FeaturesCardProps = {
  level: number;
  features: FeatureView[];
  onEdit?: () => void;
  selections?: Record<string, string | number | boolean>;
};

export function FeaturesCard({
  level,
  features,
  onEdit,
  selections,
}: FeaturesCardProps) {
  return (
    <Card>
      <CharacterCardHeader title="Class Features" onTitleClick={onEdit} />
      <CardContent>
        <FeaturesList
          level={level}
          features={features}
          selections={selections}
        />
      </CardContent>
    </Card>
  );
}
