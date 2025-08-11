import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EquipmentCard({ onEdit }: { onEdit?: () => void }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Equipment</CardTitle>
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Packs and gear…
      </CardContent>
    </Card>
  );
}
