import { ALL_PRIMARY_WEAPONS } from '@/lib/data/equipment';
import { Sword } from '@/lib/icons';
import type { PrimaryWeapon } from '@/lib/schemas/equipment';

import { type EquipmentMode, EquipmentModeTabs } from '../equipment-mode-tabs';
import { EquipmentSection } from '../equipment-section';
import { HomebrewEquipmentBrowser } from '../homebrew-equipment-browser';
import { HomebrewWeaponForm } from '../homebrew-weapon-form';
import { WeaponCardCompact } from '../weapon-card-compact';

interface PrimaryWeaponSectionProps {
  mode: EquipmentMode;
  onModeChange: (mode: EquipmentMode) => void;
  weapon: PrimaryWeapon | null;
  onWeaponChange: (weapon: PrimaryWeapon | null) => void;
  homebrewWeapon: Partial<PrimaryWeapon>;
  onHomebrewChange: (value: Partial<PrimaryWeapon>) => void;
  allowedTiers?: string[];
  campaignId?: string;
}

export function PrimaryWeaponSection({
  mode,
  onModeChange,
  weapon,
  onWeaponChange,
  homebrewWeapon,
  onHomebrewChange,
  allowedTiers,
  campaignId,
}: PrimaryWeaponSectionProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4">
      <EquipmentModeTabs activeMode={mode} onModeChange={onModeChange} />
      {mode === 'custom' ? (
        <HomebrewWeaponForm
          weaponType="Primary"
          value={homebrewWeapon}
          onChange={onHomebrewChange}
        />
      ) : mode === 'homebrew' ? (
        <HomebrewEquipmentBrowser<PrimaryWeapon>
          equipmentType="weapon"
          campaignId={campaignId}
          selectedItem={weapon}
          onSelect={(item, _contentId) => onWeaponChange(item)}
          emptyMessage="No homebrew primary weapons found."
        />
      ) : (
        <EquipmentSection
          title="Primary Weapons"
          icon={Sword}
          items={ALL_PRIMARY_WEAPONS}
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
