import { CharacterCardHeader } from '@/components/characters/presenters/card-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Armor, EquipmentLoadout, Weapon } from '@/lib/schemas/equipment';

import { ArmorChips, WeaponChips } from './equipment-chips';

type Props = {
  equipment?: EquipmentLoadout;
  onEdit?: (section?: 'primary' | 'secondary' | 'armor') => void;
};

export function EquipmentCard({ equipment, onEdit }: Props) {
  const primary = equipment?.primaryWeapon as Weapon | undefined;
  const secondary = equipment?.secondaryWeapon as Weapon | undefined;
  const armor = equipment?.armor as Armor | undefined;
  // Items managed in Inventory; not shown here
  const isInteractive = (t: EventTarget | null) => {
    if (!(t instanceof HTMLElement)) return false;
    return !!t.closest(
      'button, a, input, textarea, select, [role="button"], [role="link"], [contenteditable="true"], [data-no-open]'
    );
  };
  return (
    <Card>
      <CharacterCardHeader
        title="Equipment"
        subtitle="Tap a slot to edit"
        titleClassName="text-lg sm:text-xl"
        onTitleClick={() => onEdit?.()}
      />
      <CardContent
        role={onEdit ? 'button' : undefined}
        tabIndex={onEdit ? 0 : undefined}
        onClick={e => {
          if (!onEdit || isInteractive(e.target)) return;
          onEdit();
        }}
        onKeyDown={e => {
          if (!onEdit || isInteractive(e.target)) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEdit();
          }
        }}
        className="hover:bg-accent/30 focus-visible:ring-ring cursor-pointer space-y-3 rounded-md text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            type="button"
            aria-label={
              primary
                ? `Edit primary weapon: ${primary.name}`
                : 'Select primary weapon'
            }
            onClick={() => onEdit?.('primary')}
            className="min-w-0 text-left"
          >
            <div className="text-muted-foreground text-xs">Primary</div>
            {primary ? (
              <div className="flex items-center gap-2 truncate font-medium">
                {primary.name}
                {primary.metadata?.homebrew ? (
                  <Badge variant="outline" className="px-1 py-0 text-[10px]">
                    Homebrew
                  </Badge>
                ) : null}
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
            aria-label={
              secondary
                ? `Edit secondary weapon: ${secondary.name}`
                : 'Select secondary weapon'
            }
            onClick={() => onEdit?.('secondary')}
            className="min-w-0 text-left"
          >
            <div className="text-muted-foreground text-xs">Secondary</div>
            {secondary ? (
              <div className="flex items-center gap-2 truncate font-medium">
                {secondary.name}
                {secondary.metadata?.homebrew ? (
                  <Badge variant="outline" className="px-1 py-0 text-[10px]">
                    Homebrew
                  </Badge>
                ) : null}
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
            aria-label={armor ? `Edit armor: ${armor.name}` : 'Select armor'}
            onClick={() => onEdit?.('armor')}
            className="min-w-0 text-left"
          >
            <div className="text-muted-foreground text-xs">Armor</div>
            {armor ? (
              <div className="flex items-center gap-2 truncate font-medium">
                {armor.name}
                {armor.metadata?.homebrew ? (
                  <Badge variant="outline" className="px-1 py-0 text-[10px]">
                    Homebrew
                  </Badge>
                ) : null}
                <Badge variant="secondary" className="px-1 py-0 text-[10px]">
                  T{armor.tier}
                </Badge>
              </div>
            ) : (
              <div className="text-muted-foreground">Select armor</div>
            )}
            {armor ? <ArmorChips armor={armor} /> : null}
            {armor?.description ? (
              <div className="text-muted-foreground mt-1 text-[11px]">
                {armor.description}
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
