import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClassFeaturesCardProps {
  features: ReadonlyArray<{
    readonly name: string;
    readonly description: string;
  }>;
}

export function ClassFeaturesCard({ features }: ClassFeaturesCardProps) {
  if (!features.length) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="shrink-0">⭐</span>
          <span>Class Features</span>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {features.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-48 space-y-2 overflow-y-auto">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-muted/30 overflow-hidden rounded border p-2"
          >
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">{feature.name}</span>
              <Badge
                variant="outline"
                className="shrink-0 border-green-500/30 bg-green-500/10 text-xs text-green-700"
              >
                ✓ Unlocked
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              {feature.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
