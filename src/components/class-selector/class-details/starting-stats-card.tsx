import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Heart, Shield } from '@/lib/icons';

interface StartingStatsCardProps {
  hitPoints?: number;
  evasion?: number;
}

export function StartingStatsCard({
  hitPoints,
  evasion,
}: StartingStatsCardProps) {
  if (!hitPoints && !evasion) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart3 className="size-4 shrink-0" />
          <span>Starting Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm">
          {hitPoints && (
            <div className="flex items-center gap-2">
              <Heart className="size-4 shrink-0 text-red-500" />
              <span>HP:</span>
              <Badge variant="secondary">{hitPoints}</Badge>
            </div>
          )}
          {evasion && (
            <div className="flex items-center gap-2">
              <Shield className="size-4 shrink-0 text-blue-500" />
              <span>Evasion:</span>
              <Badge variant="secondary">{evasion}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
