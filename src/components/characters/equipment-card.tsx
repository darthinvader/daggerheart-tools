import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EquipmentLoadout } from '@/lib/schemas/equipment';

import { ArmorChips, WeaponChips } from './equipment-chips';

type Props = {
  equipment?: EquipmentLoadout;
  onEdit?: (section?: 'primary' | 'secondary' | 'armor') => void;
};

export function EquipmentCard({ equipment, onEdit }: Props) {
  const primary = equipment?.primaryWeapon;
  const secondary = equipment?.secondaryWeapon;
  const armor = equipment?.armor;
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle>Equipment</CardTitle>
        <Button size="sm" variant="outline" onClick={() => onEdit?.()}>
          Edit Equipment
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => onEdit?.('primary')}
            className="min-w-0 text-left"
          >
            <div className="text-muted-foreground text-xs">Primary</div>
            {primary ? (
              <div className="flex items-center gap-2 truncate font-medium">
                {primary.name}
                <Badge variant="secondary" className="px-1 py-0 text-[10px]">
                  T{primary.tier}
                </Badge>
              </div>
            ) : (
              <div className="text-muted-foreground">Select a weapon</div>
            )}
            {primary ? <WeaponChips weapon={primary} /> : null}
            {primary?.description ? (
              <div className="text-muted-foreground mt-1 text-[11px]">
                {primary.description}
              </div>
            ) : null}
            {primary?.features?.length ? (
              <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5 text-[11px]">
                {primary.features.map((f, i) => (
                  <li key={i}>
                    <span className="font-medium">{f.name}:</span>{' '}
                    {f.description}
                  </li>
                ))}
              </ul>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => onEdit?.('secondary')}
            className="min-w-0 text-left"
          >
            <div className="text-muted-foreground text-xs">Secondary</div>
            {secondary ? (
              <div className="flex items-center gap-2 truncate font-medium">
                {secondary.name}
                <Badge variant="secondary" className="px-1 py-0 text-[10px]">
                  T{secondary.tier}
                </Badge>
              </div>
            ) : (
              <div className="text-muted-foreground">Select a weapon</div>
            )}
            {secondary ? <WeaponChips weapon={secondary} /> : null}
            {secondary?.description ? (
              <div className="text-muted-foreground mt-1 text-[11px]">
                {secondary.description}
              </div>
            ) : null}
            {secondary?.features?.length ? (
              <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5 text-[11px]">
                {secondary.features.map((f, i) => (
                  <li key={i}>
                    <span className="font-medium">{f.name}:</span>{' '}
                    {f.description}
                  </li>
                ))}
              </ul>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => onEdit?.('armor')}
            className="min-w-0 text-left"
          >
            <div className="text-muted-foreground text-xs">Armor</div>
            {armor ? (
              <div className="flex items-center gap-2 truncate font-medium">
                {armor.name}
                <Badge variant="secondary" className="px-1 py-0 text-[10px]">
                  T{armor.tier}
                </Badge>
              </div>
            ) : (
              <div className="text-muted-foreground">Select armor</div>
            )}
            {armor ? <ArmorChips armor={armor} /> : null}
            {armor &&
            (armor as unknown as { description?: string })?.description ? (
              <div className="text-muted-foreground mt-1 text-[11px]">
                {(armor as unknown as { description?: string }).description}
              </div>
            ) : null}
            {armor?.features?.length ? (
              <ul className="text-muted-foreground mt-1 list-disc space-y-0.5 pl-5 text-[11px]">
                {armor.features.map((f, i) => (
                  <li key={i}>
                    <span className="font-medium">{f.name}:</span>{' '}
                    {f.description}
                  </li>
                ))}
              </ul>
            ) : null}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
