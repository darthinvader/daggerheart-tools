import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EquipmentLoadout } from '@/lib/schemas/equipment';

type Props = {
  equipment?: EquipmentLoadout;
  onEdit?: () => void;
};

export function EquipmentCard({ equipment, onEdit }: Props) {
  const primary = equipment?.primaryWeapon;
  const secondary = equipment?.secondaryWeapon;
  const armor = equipment?.armor;
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Equipment</CardTitle>
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="min-w-0">
            <div className="text-muted-foreground text-xs">Primary</div>
            {primary ? (
              <div className="truncate font-medium">{primary.name}</div>
            ) : (
              <div className="text-muted-foreground">Select a weapon</div>
            )}
            {primary ? (
              <div className="text-muted-foreground mt-0.5 line-clamp-1 text-[11px]">
                {primary.trait} · {primary.range} · {primary.damage.count}d
                {primary.damage.diceType}
                {primary.damage.modifier
                  ? `+${primary.damage.modifier}`
                  : ''}{' '}
                {primary.damage.type} · {primary.burden}
              </div>
            ) : null}
          </div>
          <div className="min-w-0">
            <div className="text-muted-foreground text-xs">Secondary</div>
            {secondary ? (
              <div className="truncate font-medium">{secondary.name}</div>
            ) : (
              <div className="text-muted-foreground">Select a weapon</div>
            )}
            {secondary ? (
              <div className="text-muted-foreground mt-0.5 line-clamp-1 text-[11px]">
                {secondary.trait} · {secondary.range} · {secondary.damage.count}
                d{secondary.damage.diceType}
                {secondary.damage.modifier
                  ? `+${secondary.damage.modifier}`
                  : ''}{' '}
                {secondary.damage.type} · {secondary.burden}
              </div>
            ) : null}
          </div>
          <div className="min-w-0">
            <div className="text-muted-foreground text-xs">Armor</div>
            {armor ? (
              <div className="truncate font-medium">{armor.name}</div>
            ) : (
              <div className="text-muted-foreground">Select armor</div>
            )}
            {armor ? (
              <div className="text-muted-foreground mt-0.5 line-clamp-1 text-[11px]">
                Base {armor.baseScore} · Thresholds M
                {armor.baseThresholds.major}/S
                {armor.baseThresholds.severe}
                {armor.evasionModifier
                  ? ` · Evasion ${armor.evasionModifier >= 0 ? `+${armor.evasionModifier}` : armor.evasionModifier}`
                  : ''}
                {armor.agilityModifier
                  ? ` · Agility ${armor.agilityModifier >= 0 ? `+${armor.agilityModifier}` : armor.agilityModifier}`
                  : ''}
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
