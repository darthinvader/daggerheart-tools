import { ALL_SECONDARY_WEAPONS } from '@/lib/data/equipment';
import { Axe } from '@/lib/icons';
import type { SecondaryWeapon } from '@/lib/schemas/equipment';

import { type EquipmentMode, EquipmentModeTabs } from '../equipment-mode-tabs';
import { EquipmentSection } from '../equipment-section';
import { HomebrewEquipmentBrowser } from '../homebrew-equipment-browser';
import { HomebrewWeaponForm } from '../homebrew-weapon-form';
import { WeaponCardCompact } from '../weapon-card-compact';

interface SecondaryWeaponSectionProps {
  mode: EquipmentMode;
  onModeChange: (mode: EquipmentMode) => void;
  weapon: SecondaryWeapon | null;
  onWeaponChange: (weapon: SecondaryWeapon | null) => void;
  homebrewWeapon: Partial<SecondaryWeapon>;
  onHomebrewChange: (value: Partial<SecondaryWeapon>) => void;
  allowedTiers?: string[];
  campaignId?: string;
}

export function SecondaryWeaponSection({
  mode,
  onModeChange,
  weapon,
  onWeaponChange,
  homebrewWeapon,
  onHomebrewChange,
  allowedTiers,
  campaignId,
}: SecondaryWeaponSectionProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4">
      <EquipmentModeTabs activeMode={mode} onModeChange={onModeChange} />
      {mode === 'custom' ? (
        <HomebrewWeaponForm
          weaponType="Secondary"
          value={homebrewWeapon}
          onChange={onHomebrewChange}
        />
      ) : mode === 'homebrew' ? (
        <HomebrewEquipmentBrowser<SecondaryWeapon>
          equipmentType="weapon"
          campaignId={campaignId}
          selectedItem={weapon}
          onSelect={(item, _contentId) => onWeaponChange(item)}
          emptyMessage="No homebrew secondary weapons found."
        />
      ) : (
        <EquipmentSection
          title="Secondary Weapons"
          icon={Axe}
          items={ALL_SECONDARY_WEAPONS}
          selectedItem={weapon}
          onSelect={onWeaponChange}
          allowedTiers={allowedTiers}
          renderCard={(w, isSelected, onSelect) => (
            <WeaponCardCompact
              key={w.name}
              weapon={w}
              isSelected={isSelected}
              onClick={onSelect}
            />
          )}
        />
      )}
    </div>
  );
}
