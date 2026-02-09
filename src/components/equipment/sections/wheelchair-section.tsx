import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ALL_COMBAT_WHEELCHAIRS } from '@/lib/data/equipment';
import { Wheelchair } from '@/lib/icons';
import type { CombatWheelchair } from '@/lib/schemas/equipment';

import { type EquipmentMode, EquipmentModeTabs } from '../equipment-mode-tabs';
import { EquipmentSection } from '../equipment-section';
import { HomebrewEquipmentBrowser } from '../homebrew-equipment-browser';
import { HomebrewWeaponForm } from '../homebrew-weapon-form';
import { WheelchairCardCompact } from '../wheelchair-card-compact';

function DisabledMessage() {
  return (
    <p className="text-muted-foreground py-4 text-center text-sm">
      Enable combat wheelchair to select one
    </p>
  );
}

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
  allowedTiers?: string[];
  campaignId?: string;
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
  allowedTiers,
  campaignId,
}: WheelchairSectionProps) {
  const handleHomebrewChange = (v: Partial<CombatWheelchair>) => {
    onHomebrewChange({
      ...v,
      frameType: homebrewWheelchair.frameType ?? 'Light',
      wheelchairFeatures: homebrewWheelchair.wheelchairFeatures ?? [],
    });
  };

  const handleHomebrewSelect = (item: CombatWheelchair, _contentId: string) => {
    onWheelchairChange(item);
  };

  const renderWheelchairCard = (
    chair: CombatWheelchair,
    isSelected: boolean,
    onSelect: () => void
  ) => (
    <WheelchairCardCompact
      key={chair.name}
      wheelchair={chair}
      isSelected={isSelected}
      onClick={onSelect}
    />
  );

  const enableSwitch = (
    <div className="flex items-center gap-2">
      <Label className="text-muted-foreground text-xs">Enable</Label>
      <Switch checked={enabled} onCheckedChange={onEnabledChange} />
    </div>
  );

  const wheelchairContent =
    mode === 'custom' ? (
      <HomebrewWeaponForm
        weaponType="Primary"
        value={homebrewWheelchair}
        onChange={handleHomebrewChange}
      />
    ) : mode === 'homebrew' ? (
      <HomebrewEquipmentBrowser<CombatWheelchair>
        equipmentType="wheelchair"
        campaignId={campaignId}
        selectedItem={wheelchair}
        onSelect={handleHomebrewSelect}
        emptyMessage="No homebrew combat wheelchairs found."
      />
    ) : (
      <EquipmentSection
        title="Combat Wheelchairs"
        icon={Wheelchair}
        items={ALL_COMBAT_WHEELCHAIRS}
        selectedItem={wheelchair}
        onSelect={onWheelchairChange}
        allowedTiers={allowedTiers}
        renderCard={renderWheelchairCard}
      />
    );

  if (hideTitle) {
    return (
      <div className="flex min-h-0 flex-1 flex-col space-y-4">
        <EquipmentModeTabs activeMode={mode} onModeChange={onModeChange} />
        <div className="flex items-center justify-end">{enableSwitch}</div>
        {!enabled ? <DisabledMessage /> : wheelchairContent}
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
        <DisabledMessage />
      ) : (
        <>
          <EquipmentModeTabs activeMode={mode} onModeChange={onModeChange} />
          {wheelchairContent}
        </>
      )}
    </div>
  );
}
