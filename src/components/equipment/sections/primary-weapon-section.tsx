import { ALL_PRIMARY_WEAPONS } from '@/lib/data/equipment';
import type { PrimaryWeapon } from '@/lib/schemas/equipment';

import { type EquipmentMode, EquipmentModeTabs } from '../equipment-mode-tabs';
import { EquipmentSection } from '../equipment-section';
import { HomebrewWeaponForm } from '../homebrew-weapon-form';
import { WeaponCardCompact } from '../weapon-card-compact';

interface PrimaryWeaponSectionProps {
  mode: EquipmentMode;
  onModeChange: (mode: EquipmentMode) => void;
  weapon: PrimaryWeapon | null;
  onWeaponChange: (weapon: PrimaryWeapon | null) => void;
  homebrewWeapon: Partial<PrimaryWeapon>;
  onHomebrewChange: (value: Partial<PrimaryWeapon>) => void;
}

export function PrimaryWeaponSection({
  mode,
  onModeChange,
  weapon,
  onWeaponChange,
  homebrewWeapon,
  onHomebrewChange,
}: PrimaryWeaponSectionProps) {
  return (
    <div className="space-y-4">
      <EquipmentModeTabs activeMode={mode} onModeChange={onModeChange} />
      {mode === 'homebrew' ? (
        <HomebrewWeaponForm
          weaponType="Primary"
          value={homebrewWeapon}
          onChange={onHomebrewChange}
        />
      ) : (
        <EquipmentSection
          title="Primary Weapons"
          icon="⚔️"
          items={ALL_PRIMARY_WEAPONS}
          selectedItem={weapon}
          onSelect={onWeaponChange}
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
