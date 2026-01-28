import {
  Activity,
  BarChart3,
  Crosshair,
  Eye,
  Footprints,
  Library,
  type LucideIcon,
  Sparkles,
} from 'lucide-react';

import type { TraitsState } from '@/components/traits';
import type { CharacterTrait } from '@/lib/equipment-feature-parser';
import { cn } from '@/lib/utils';

/** Equipment modifiers for each trait */
export interface QuickTraitEquipmentModifiers {
  Agility?: number;
  Strength?: number;
  Finesse?: number;
  Instinct?: number;
  Presence?: number;
  Knowledge?: number;
}

interface QuickTraitsInfoProps {
  traits: TraitsState;
  equipmentModifiers?: QuickTraitEquipmentModifiers;
  className?: string;
}

const TRAIT_CONFIG: { name: string; icon: LucideIcon }[] = [
  { name: 'Agility', icon: Footprints },
  { name: 'Strength', icon: Activity },
  { name: 'Finesse', icon: Crosshair },
  { name: 'Instinct', icon: Eye },
  { name: 'Presence', icon: Sparkles },
  { name: 'Knowledge', icon: Library },
];

export function QuickTraitsInfo({
  traits,
  equipmentModifiers,
  className,
}: QuickTraitsInfoProps) {
  return (
    <div className={cn('bg-card rounded-lg border p-2 sm:p-3', className)}>
      <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
        <BarChart3 className="size-4 sm:size-5" />
        <span className="text-sm font-semibold sm:text-base">Traits</span>
      </div>
      <div className="grid grid-cols-3 gap-1 sm:grid-cols-6 sm:gap-2">
        {TRAIT_CONFIG.map(({ name, icon: Icon }) => {
          const trait = traits[name as keyof TraitsState];
          const equipMod = equipmentModifiers?.[name as CharacterTrait] ?? 0;
          const total = trait.value + trait.bonus + equipMod;
          const modifier = total >= 0 ? `+${total}` : `${total}`;
          const hasEquipMod = equipMod !== 0;
          const hasBonus = trait.bonus !== 0 || hasEquipMod;

          return (
            <div
              key={name}
              className={cn(
                'flex flex-col items-center rounded border p-1 sm:p-2',
                trait.marked && 'bg-primary/10 border-primary/30'
              )}
            >
              <Icon className="size-3 sm:size-4" />
              <span className="text-muted-foreground text-[10px] sm:text-xs">
                {name}
              </span>
              <span className="text-primary text-base font-bold sm:text-lg">
                {modifier}
              </span>
              {hasBonus && (
                <span className="text-muted-foreground text-[9px] sm:text-xs">
                  ({trait.value}
                  {trait.bonus >= 0 ? '+' : ''}
                  {trait.bonus}
                  {hasEquipMod && (
                    <span
                      className={
                        equipMod < 0 ? 'text-destructive' : 'text-green-600'
                      }
                    >
                      {equipMod >= 0 ? '+' : ''}
                      {equipMod}
                    </span>
                  )}
                  )
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
