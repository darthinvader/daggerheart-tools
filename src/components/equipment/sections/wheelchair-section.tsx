import { ChevronDown, ChevronUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ALL_COMBAT_WHEELCHAIRS } from '@/lib/data/equipment';
import type { CombatWheelchair } from '@/lib/schemas/equipment';

import { EquipmentSection } from '../equipment-section';
import { HomebrewWeaponForm } from '../homebrew-weapon-form';
import { WeaponCardCompact } from '../weapon-card-compact';

interface WheelchairSectionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  mode: 'standard' | 'homebrew';
  onModeChange: (homebrew: boolean) => void;
  wheelchair: CombatWheelchair | null;
  onWheelchairChange: (wheelchair: CombatWheelchair | null) => void;
  homebrewWheelchair: Partial<CombatWheelchair>;
  onHomebrewChange: (value: Partial<CombatWheelchair>) => void;
}

export function WheelchairSection({
  isOpen,
  onOpenChange,
  enabled,
  onEnabledChange,
  mode,
  onModeChange,
  wheelchair,
  onWheelchairChange,
  homebrewWheelchair,
  onHomebrewChange,
}: WheelchairSectionProps) {
  const selectedName = enabled
    ? mode === 'homebrew'
      ? homebrewWheelchair.name || '🔧 Homebrew'
      : (wheelchair?.name ?? 'Not selected')
    : undefined;

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 p-0 hover:bg-transparent"
              >
                <span className="text-lg font-semibold">
                  ♿ Combat Wheelchair
                </span>
                {selectedName && !isOpen && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedName}
                  </Badge>
                )}
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <div className="flex items-center gap-3">
              {enabled && (
                <div className="flex items-center gap-2">
                  <Label className="text-muted-foreground text-xs">
                    Homebrew
                  </Label>
                  <Switch
                    checked={mode === 'homebrew'}
                    onCheckedChange={onModeChange}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Label className="text-muted-foreground text-xs">Enable</Label>
                <Switch checked={enabled} onCheckedChange={onEnabledChange} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {!enabled ? (
              <p className="text-muted-foreground py-4 text-center text-sm">
                Enable combat wheelchair to select one
              </p>
            ) : mode === 'homebrew' ? (
              <HomebrewWeaponForm
                weaponType="Primary"
                value={homebrewWheelchair}
                onChange={v =>
                  onHomebrewChange({
                    ...v,
                    frameType: homebrewWheelchair.frameType ?? 'Light',
                    wheelchairFeatures:
                      homebrewWheelchair.wheelchairFeatures ?? [],
                  })
                }
              />
            ) : (
              <EquipmentSection
                title="Combat Wheelchairs"
                icon="♿"
                items={ALL_COMBAT_WHEELCHAIRS}
                selectedItem={wheelchair}
                onSelect={onWheelchairChange}
                renderCard={(chair, isSelected, onSelect) => (
                  <WeaponCardCompact
                    key={chair.name}
                    weapon={chair}
                    isSelected={isSelected}
                    onClick={onSelect}
                  />
                )}
              />
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
