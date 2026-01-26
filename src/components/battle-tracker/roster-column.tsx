import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RosterColumnProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  emptyText: string;
  children: React.ReactNode;
}

export function RosterColumn({
  title,
  icon,
  count,
  emptyText,
  children,
}: RosterColumnProps) {
  return (
    <Card className="flex h-[calc(100vh-200px)] min-h-125 flex-col">
      <CardHeader className="flex-none border-b py-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            {icon} {title}
          </span>
          <Badge variant="secondary">{count}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-3">
            {count === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center py-8 text-center text-sm">
                {icon}
                <span className="mt-2">{emptyText}</span>
              </div>
            ) : (
              children
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
