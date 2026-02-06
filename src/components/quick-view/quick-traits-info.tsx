import {
  Activity,
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

const TRAIT_CONFIG: { name: string; icon: LucideIcon; accent: string }[] = [
  { name: 'Agility', icon: Footprints, accent: 'quick-trait-agility' },
  { name: 'Strength', icon: Activity, accent: 'quick-trait-strength' },
  { name: 'Finesse', icon: Crosshair, accent: 'quick-trait-finesse' },
  { name: 'Instinct', icon: Eye, accent: 'quick-trait-instinct' },
  { name: 'Presence', icon: Sparkles, accent: 'quick-trait-presence' },
  { name: 'Knowledge', icon: Library, accent: 'quick-trait-knowledge' },
];

export function QuickTraitsInfo({
  traits,
  equipmentModifiers,
  className,
}: QuickTraitsInfoProps) {
  return (
    <div className={cn('quick-traits-grid', className)}>
      {TRAIT_CONFIG.map(({ name, icon: Icon, accent }) => {
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
              'quick-trait-cell',
              accent,
              trait.marked && 'quick-trait-marked'
            )}
          >
            <div className="quick-trait-icon-wrap">
              <Icon className="size-3.5 sm:size-4" />
            </div>
            <span className="quick-trait-value">{modifier}</span>
            <span className="quick-trait-name">{name}</span>
            <span className="quick-trait-roll-hint">d12 {modifier}</span>
            {hasBonus && (
              <span className="quick-trait-breakdown">
                {trait.value}
                {trait.bonus >= 0 ? '+' : ''}
                {trait.bonus}
                {hasEquipMod && (
                  <span
                    className={
                      equipMod < 0 ? 'text-destructive' : 'text-green-500'
                    }
                  >
                    {equipMod >= 0 ? '+' : ''}
                    {equipMod}
                  </span>
                )}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
