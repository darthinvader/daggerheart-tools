import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { SpecialArmor, StandardArmor } from '@/lib/schemas/equipment';

import { isStandardArmor } from './constants';

type ArmorType = StandardArmor | SpecialArmor;

interface ArmorCardCompactProps {
  armor: ArmorType;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ArmorCardCompact({
  armor,
  isSelected,
  onClick,
}: ArmorCardCompactProps) {
  return (
    <div
      onClick={onClick}
      className={`hover:border-primary/50 hover:bg-accent/50 relative cursor-pointer rounded-lg border p-4 transition-all ${isSelected ? 'border-primary bg-primary/5 shadow-sm' : 'bg-card'} `}
    >
      {isSelected && (
        <div className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full">
          <Check className="h-3 w-3" />
        </div>
      )}

      <div className="mb-3 flex items-start justify-between gap-2">
        <h4 className="text-base leading-tight font-semibold">
          🛡️ {armor.name}
        </h4>
        <Badge variant="outline" className="shrink-0 text-xs">
          Tier {armor.tier}
        </Badge>
      </div>

      {/* Prominent Damage Thresholds Section */}
      <div className="bg-muted/30 mb-3 rounded-lg border p-3">
        <div className="mb-2 text-xs font-medium">Damage Thresholds</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-background rounded-md p-2">
            <div className="text-muted-foreground text-[10px]">Score</div>
            <div className="text-lg font-bold">🛡️ {armor.baseScore}</div>
          </div>
          <div className="bg-background rounded-md p-2">
            <div className="text-muted-foreground text-[10px]">Major</div>
            <div className="text-lg font-bold text-amber-600">
              💥 {armor.baseThresholds.major}+
            </div>
          </div>
          <div className="bg-background rounded-md p-2">
            <div className="text-muted-foreground text-[10px]">Severe</div>
            <div className="text-lg font-bold text-red-600">
              ⚡ {armor.baseThresholds.severe}+
            </div>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground mb-2 flex gap-4 text-sm">
        <span
          className={
            armor.evasionModifier > 0
              ? 'text-green-600'
              : armor.evasionModifier < 0
                ? 'text-red-600'
                : ''
          }
        >
          Evasion: {armor.evasionModifier > 0 ? '+' : ''}
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
          Agility: {armor.agilityModifier > 0 ? '+' : ''}
          {armor.agilityModifier}
        </span>
      </div>

      {isStandardArmor(armor) && (
        <Badge variant="secondary" className="mb-2 text-xs">
          {armor.armorType}
        </Badge>
      )}

      {armor.features.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {armor.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="bg-muted/50 rounded px-2 py-1.5 text-xs">
              <span className="font-semibold">{feature.name}</span>
              {feature.description && (
                <span className="text-muted-foreground">
                  {' — '}
                  {feature.description}
                </span>
              )}
            </div>
          ))}
          {armor.features.length > 3 && (
            <span className="text-muted-foreground text-xs">
              +{armor.features.length - 3} more features
            </span>
          )}
        </div>
      )}
    </div>
  );
}
