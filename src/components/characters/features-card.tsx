import { FeaturesList } from '@/components/characters/features-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Class Features</CardTitle>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </CardHeader>
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
