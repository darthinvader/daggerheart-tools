import { ALL_SECONDARY_WEAPONS } from '@/lib/data/equipment';
import type { SecondaryWeapon } from '@/lib/schemas/equipment';

import { type EquipmentMode, EquipmentModeTabs } from '../equipment-mode-tabs';
import { EquipmentSection } from '../equipment-section';
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
}

export function SecondaryWeaponSection({
  mode,
  onModeChange,
  weapon,
  onWeaponChange,
  homebrewWeapon,
  onHomebrewChange,
  allowedTiers,
}: SecondaryWeaponSectionProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4">
      <EquipmentModeTabs activeMode={mode} onModeChange={onModeChange} />
      {mode === 'homebrew' ? (
        <HomebrewWeaponForm
          weaponType="Secondary"
          value={homebrewWeapon}
          onChange={onHomebrewChange}
        />
      ) : (
        <EquipmentSection
          title="Secondary Weapons"
          icon="🗡️"
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
