import { ALL_STANDARD_ARMOR } from '@/lib/data/equipment';
import { Shield } from '@/lib/icons';
import type { StandardArmor } from '@/lib/schemas/equipment';

import { ArmorCardCompact } from '../armor-card-compact';
import { type EquipmentMode, EquipmentModeTabs } from '../equipment-mode-tabs';
import { EquipmentSection } from '../equipment-section';
import { HomebrewArmorForm } from '../homebrew-armor-form';
import { HomebrewEquipmentBrowser } from '../homebrew-equipment-browser';

interface ArmorSectionProps {
  mode: EquipmentMode;
  onModeChange: (mode: EquipmentMode) => void;
  armor: StandardArmor | null;
  onArmorChange: (armor: StandardArmor | null) => void;
  homebrewArmor: Partial<StandardArmor>;
  onHomebrewChange: (value: Partial<StandardArmor>) => void;
  allowedTiers?: string[];
  campaignId?: string;
}

export function ArmorSection({
  mode,
  onModeChange,
  armor,
  onArmorChange,
  homebrewArmor,
  onHomebrewChange,
  allowedTiers,
  campaignId,
}: ArmorSectionProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4">
      <EquipmentModeTabs activeMode={mode} onModeChange={onModeChange} />
      {mode === 'custom' ? (
        <HomebrewArmorForm value={homebrewArmor} onChange={onHomebrewChange} />
      ) : mode === 'homebrew' ? (
        <HomebrewEquipmentBrowser<StandardArmor>
          equipmentType="armor"
          campaignId={campaignId}
          selectedItem={armor}
          onSelect={(item, _contentId) => onArmorChange(item)}
          emptyMessage="No homebrew armor found."
        />
      ) : (
        <EquipmentSection
          title="Armor"
          icon={Shield}
          items={ALL_STANDARD_ARMOR}
          selectedItem={armor}
          onSelect={onArmorChange}
          allowedTiers={allowedTiers}
          renderCard={(a, isSelected, onSelect) => (
            <ArmorCardCompact
              key={a.name}
              armor={a}
              isSelected={isSelected}
              onClick={onSelect}
            />
          )}
        />
      )}
    </div>
  );
}
