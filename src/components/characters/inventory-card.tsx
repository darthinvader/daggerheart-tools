import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Inventory } from '@/lib/schemas/equipment';

type Props = { inventory?: Inventory; onEdit?: () => void };

export function InventoryCard({ inventory, onEdit }: Props) {
  const slots = inventory?.slots ?? [];
  const totalItems = slots.reduce((sum, s) => sum + (s.quantity ?? 1), 0);
  const equipped = slots.filter(s => s.isEquipped).slice(0, 3);
  const remaining = Math.max(0, (inventory?.maxItems ?? 0) - slots.length);
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Inventory</CardTitle>
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="text-muted-foreground">
          {slots.length} slots · {totalItems} items
          {inventory?.maxItems ? ` · ${remaining} free` : ''}
        </div>
        {equipped.length > 0 ? (
          <div className="text-muted-foreground line-clamp-1 text-xs">
            Equipped: {equipped.map(s => s.item.name).join(', ')}
            {slots.filter(s => s.isEquipped).length > equipped.length
              ? '…'
              : ''}
          </div>
        ) : (
          <div className="text-muted-foreground text-xs">No items equipped</div>
        )}
      </CardContent>
    </Card>
  );
}
