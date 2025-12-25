import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HopeFeatureCardProps {
  feature: {
    readonly name: string;
    readonly description: string;
    readonly hopeCost: number;
  };
}

export function HopeFeatureCard({ feature }: HopeFeatureCardProps) {
  return (
    <Card className="overflow-hidden border-yellow-500/30 bg-yellow-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="shrink-0">💫</span>
          <span>Hope Feature</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{feature.name}</span>
          <Badge variant="outline" className="shrink-0 text-xs">
            Cost: {feature.hopeCost} Hope
          </Badge>
        </div>
        <p className="text-muted-foreground text-xs">{feature.description}</p>
      </CardContent>
    </Card>
  );
}
