import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function InventoryCard({ onEdit }: { onEdit?: () => void }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Inventory</CardTitle>
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Items and quantities…
      </CardContent>
    </Card>
  );
}
