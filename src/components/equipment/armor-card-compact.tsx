import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { SpecialArmor, StandardArmor } from '@/lib/schemas/equipment';

type ArmorType = StandardArmor | SpecialArmor;

interface ArmorCardCompactProps {
  armor: ArmorType;
  isSelected?: boolean;
  onClick?: () => void;
}

function isStandardArmor(armor: ArmorType): armor is StandardArmor {
  return armor.isStandard === true;
}

export function ArmorCardCompact({
  armor,
  isSelected,
  onClick,
}: ArmorCardCompactProps) {
  return (
    <div
      onClick={onClick}
      className={`hover:border-primary/50 hover:bg-accent/50 relative cursor-pointer rounded-lg border p-3 transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'bg-card'} `}
    >
      {isSelected && (
        <div className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full">
          <Check className="h-3 w-3" />
        </div>
      )}

      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm leading-tight font-semibold">🛡️ {armor.name}</h4>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          T{armor.tier}
        </Badge>
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        <Badge variant="secondary" className="text-[10px]">
          🛡️ {armor.baseScore}
        </Badge>
        <Badge variant="secondary" className="text-[10px]">
          💥 {armor.baseThresholds.major}
        </Badge>
        <Badge variant="secondary" className="text-[10px]">
          ⚡ {armor.baseThresholds.severe}
        </Badge>
      </div>

      <div className="text-muted-foreground flex gap-3 text-xs">
        <span
          className={
            armor.evasionModifier > 0
              ? 'text-green-600'
              : armor.evasionModifier < 0
                ? 'text-red-600'
                : ''
          }
        >
          Eva: {armor.evasionModifier > 0 ? '+' : ''}
          {armor.evasionModifier}
        </span>
        <span
          className={
            armor.agilityModifier > 0
              ? 'text-green-600'
              : armor.agilityModifier < 0
                ? 'text-red-600'
                : ''
          }
        >
          Agi: {armor.agilityModifier > 0 ? '+' : ''}
          {armor.agilityModifier}
        </span>
      </div>

      {isStandardArmor(armor) && (
        <div className="text-muted-foreground mt-1 text-[10px]">
          {armor.armorType}
        </div>
      )}

      {armor.features.length > 0 && (
        <div className="mt-2 space-y-1">
          {armor.features.slice(0, 2).map((feature, idx) => (
            <div
              key={idx}
              className="bg-muted/50 rounded px-2 py-1 text-[10px]"
            >
              <span className="font-semibold">{feature.name}</span>
              {feature.description && (
                <span className="text-muted-foreground">
                  {' — '}
                  {feature.description}
                </span>
              )}
            </div>
          ))}
          {armor.features.length > 2 && (
            <span className="text-muted-foreground text-[10px]">
              +{armor.features.length - 2} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
