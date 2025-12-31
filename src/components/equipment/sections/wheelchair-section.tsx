import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ALL_COMBAT_WHEELCHAIRS } from '@/lib/data/equipment';
import type { CombatWheelchair } from '@/lib/schemas/equipment';

import { type EquipmentMode, EquipmentModeTabs } from '../equipment-mode-tabs';
import { EquipmentSection } from '../equipment-section';
import { HomebrewWeaponForm } from '../homebrew-weapon-form';
import { WheelchairCardCompact } from '../wheelchair-card-compact';

interface WheelchairSectionProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  mode: EquipmentMode;
  onModeChange: (mode: EquipmentMode) => void;
  wheelchair: CombatWheelchair | null;
  onWheelchairChange: (wheelchair: CombatWheelchair | null) => void;
  homebrewWheelchair: Partial<CombatWheelchair>;
  onHomebrewChange: (value: Partial<CombatWheelchair>) => void;
  hideTitle?: boolean;
}

export function WheelchairSection({
  enabled,
  onEnabledChange,
  mode,
  onModeChange,
  wheelchair,
  onWheelchairChange,
  homebrewWheelchair,
  onHomebrewChange,
  hideTitle = false,
}: WheelchairSectionProps) {
  const enableSwitch = (
    <div className="flex items-center gap-2">
      <Label className="text-muted-foreground text-xs">Enable</Label>
      <Switch checked={enabled} onCheckedChange={onEnabledChange} />
    </div>
  );

  const wheelchairContent =
    mode === 'homebrew' ? (
      <HomebrewWeaponForm
        weaponType="Primary"
        value={homebrewWheelchair}
        onChange={v =>
          onHomebrewChange({
            ...v,
            frameType: homebrewWheelchair.frameType ?? 'Light',
            wheelchairFeatures: homebrewWheelchair.wheelchairFeatures ?? [],
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
          <WheelchairCardCompact
            key={chair.name}
            wheelchair={chair}
            isSelected={isSelected}
            onClick={onSelect}
          />
        )}
      />
    );

  if (hideTitle) {
    return (
      <div className="flex min-h-0 flex-1 flex-col space-y-4">
        <EquipmentModeTabs activeMode={mode} onModeChange={onModeChange} />
        <div className="flex items-center justify-end">{enableSwitch}</div>
        {!enabled ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            Enable combat wheelchair to select one
          </p>
        ) : (
          wheelchairContent
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-lg font-semibold">Combat Wheelchair</span>
        {enableSwitch}
      </div>
      {!enabled ? (
        <p className="text-muted-foreground py-4 text-center text-sm">
          Enable combat wheelchair to select one
        </p>
      ) : (
        <>
          <EquipmentModeTabs activeMode={mode} onModeChange={onModeChange} />
          {wheelchairContent}
        </>
      )}
    </div>
  );
}
