import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scroll, Shield, Sparkles, Zap } from '@/lib/icons';
import type { SpecialArmor, StandardArmor } from '@/lib/schemas/equipment';

import { isStandardArmor } from './constants';

type ArmorType = StandardArmor | SpecialArmor;

interface ArmorCardProps {
  armor: ArmorType;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function ArmorCard({ armor, isSelected, onSelect }: ArmorCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-primary ring-2' : ''}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" /> {armor.name}
          </CardTitle>
          <Badge variant="outline">Tier {armor.tier}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="flex items-center gap-1 text-xs"
          >
            <Shield className="h-3 w-3" /> Score: {armor.baseScore}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Major: {armor.baseThresholds.major}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-1 text-xs"
          >
            <Zap className="h-3 w-3" /> Severe: {armor.baseThresholds.severe}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">
            <span className="font-medium">Evasion:</span>{' '}
            <span
              className={
                armor.evasionModifier > 0
                  ? 'text-green-600'
                  : armor.evasionModifier < 0
                    ? 'text-red-600'
                    : ''
              }
            >
              {armor.evasionModifier > 0
                ? `+${armor.evasionModifier}`
                : armor.evasionModifier}
            </span>
          </div>
          <div className="text-muted-foreground">
            <span className="font-medium">Agility:</span>{' '}
            <span
              className={
                armor.agilityModifier > 0
                  ? 'text-green-600'
                  : armor.agilityModifier < 0
                    ? 'text-red-600'
                    : ''
              }
            >
              {armor.agilityModifier > 0
                ? `+${armor.agilityModifier}`
                : armor.agilityModifier}
            </span>
          </div>
        </div>

        {isStandardArmor(armor) && (
          <div className="text-muted-foreground text-sm">
            <span className="font-medium">Type:</span> {armor.armorType}
          </div>
        )}

        {!isStandardArmor(armor) && armor.materialType && (
          <div className="text-muted-foreground text-sm">
            <span className="font-medium">Material:</span> {armor.materialType}
          </div>
        )}

        {armor.features.length > 0 && (
          <div className="space-y-1">
            <p className="flex items-center gap-1 text-sm font-medium">
              <Sparkles className="h-4 w-4" /> Features:
            </p>
            {armor.features.map((feature, idx) => (
              <div key={idx} className="bg-muted rounded p-2 text-xs">
                <span className="font-semibold">{feature.name}:</span>{' '}
                {feature.description}
              </div>
            ))}
          </div>
        )}

        {!isStandardArmor(armor) && armor.originDescription && (
          <div className="text-muted-foreground flex items-start gap-1.5 text-xs italic">
            <Scroll className="mt-0.5 size-3 shrink-0" />{' '}
            {armor.originDescription}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
