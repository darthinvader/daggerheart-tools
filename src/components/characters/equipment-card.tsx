import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type EquipmentCardProps = {
  onEdit?: () => void;
  disabled?: boolean;
};

export function EquipmentCard({ onEdit, disabled = true }: EquipmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment & Inventory</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm">
          Weapons, armor, items, gold…
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          disabled={disabled}
        >
          Edit
        </Button>
      </CardContent>
    </Card>
  );
}
