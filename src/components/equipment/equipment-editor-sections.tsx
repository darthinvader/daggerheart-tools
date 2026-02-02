import { CustomEquipmentSection } from './custom-equipment-section';
import type { EquipmentState } from './equipment-editor';
import type { EquipmentFilter } from './equipment-filter-bar';
import {
  ArmorSection,
  PrimaryWeaponSection,
  SecondaryWeaponSection,
  WheelchairSection,
} from './sections';

interface EquipmentEditorSectionsProps {
  filter: EquipmentFilter;
  state: EquipmentState;
  updateState: (updates: Partial<EquipmentState>) => void;
  campaignId?: string;
}

export function EquipmentEditorSections({
  filter,
  state,
  updateState,
  campaignId,
}: EquipmentEditorSectionsProps) {
  const showPrimary = filter === 'all' || filter === 'primary';
  const showSecondary = filter === 'all' || filter === 'secondary';
  const showArmor = filter === 'all' || filter === 'armor';
  const showWheelchair = filter === 'all' || filter === 'wheelchair';
  const showCustom = filter === 'all' || filter === 'custom';

  return (
    <>
      {showPrimary && (
        <PrimaryWeaponSection
          mode={state.primaryWeaponMode}
          onModeChange={mode => updateState({ primaryWeaponMode: mode })}
          weapon={state.primaryWeapon}
          onWeaponChange={weapon => updateState({ primaryWeapon: weapon })}
          homebrewWeapon={state.homebrewPrimaryWeapon}
          onHomebrewChange={v => updateState({ homebrewPrimaryWeapon: v })}
          campaignId={campaignId}
        />
      )}

      {showSecondary && (
        <SecondaryWeaponSection
          mode={state.secondaryWeaponMode}
          onModeChange={mode => updateState({ secondaryWeaponMode: mode })}
          weapon={state.secondaryWeapon}
          onWeaponChange={weapon => updateState({ secondaryWeapon: weapon })}
          homebrewWeapon={state.homebrewSecondaryWeapon}
          onHomebrewChange={v => updateState({ homebrewSecondaryWeapon: v })}
          campaignId={campaignId}
        />
      )}

      {showArmor && (
        <ArmorSection
          mode={state.armorMode}
          onModeChange={mode => updateState({ armorMode: mode })}
          armor={state.armor}
          onArmorChange={armor => updateState({ armor })}
          homebrewArmor={state.homebrewArmor}
          onHomebrewChange={v => updateState({ homebrewArmor: v })}
          campaignId={campaignId}
        />
      )}

      {showWheelchair && (
        <WheelchairSection
          enabled={state.useCombatWheelchair}
          onEnabledChange={v => updateState({ useCombatWheelchair: v })}
          mode={state.wheelchairMode}
          onModeChange={mode => updateState({ wheelchairMode: mode })}
          wheelchair={state.combatWheelchair}
          onWheelchairChange={chair => updateState({ combatWheelchair: chair })}
          homebrewWheelchair={state.homebrewWheelchair}
          onHomebrewChange={v => updateState({ homebrewWheelchair: v })}
          campaignId={campaignId}
        />
      )}

      {showCustom && (
        <CustomEquipmentSection customSlots={state.customSlots ?? []} />
      )}
    </>
  );
}
