import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DemoCardProps {
  badge: React.ReactNode;
  badgeClassName?: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function DemoCard({
  badge,
  badgeClassName,
  label,
  children,
  className,
}: DemoCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Badge variant="secondary" className={badgeClassName}>
            {badge}
          </Badge>
          <span className="text-muted-foreground font-normal">{label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

export function EmptyStateCard({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Badge variant="outline">Empty State</Badge>
          <span className="text-muted-foreground font-normal">{label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
