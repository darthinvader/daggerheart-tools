import { CustomEquipmentSection } from './custom-equipment-section';
import type { CustomEquipment } from './custom-slot-editor';
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
  onAddCustomSlot: () => void;
}

export function EquipmentEditorSections({
  filter,
  state,
  updateState,
  onAddCustomSlot,
}: EquipmentEditorSectionsProps) {
  const showPrimary = filter === 'all' || filter === 'primary';
  const showSecondary = filter === 'all' || filter === 'secondary';
  const showArmor = filter === 'all' || filter === 'armor';
  const showWheelchair = filter === 'all' || filter === 'wheelchair';
  const showCustom = filter === 'all' || filter === 'custom';

  const handleCustomUpdate = (id: string, eq: CustomEquipment) => {
    updateState({
      customSlots: state.customSlots.map(s => (s.id === id ? eq : s)),
    });
  };

  const handleCustomDelete = (id: string) => {
    updateState({
      customSlots: state.customSlots.filter(s => s.id !== id),
    });
  };

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
        />
      )}

      {showCustom && (
        <CustomEquipmentSection
          slots={state.customSlots}
          onAdd={onAddCustomSlot}
          onUpdate={handleCustomUpdate}
          onDelete={handleCustomDelete}
        />
      )}
    </>
  );
}
