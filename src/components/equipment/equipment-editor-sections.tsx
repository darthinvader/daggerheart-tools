import { useCallback } from 'react';

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
  const shouldShow = (category: EquipmentFilter) =>
    filter === 'all' || filter === category;

  const handleUpdate = useCallback(
    <K extends keyof EquipmentState>(key: K) =>
      (value: EquipmentState[K]) =>
        updateState({ [key]: value } as Partial<EquipmentState>),
    [updateState]
  );

  return (
    <>
      {shouldShow('primary') && (
        <PrimaryWeaponSection
          mode={state.primaryWeaponMode}
          onModeChange={handleUpdate('primaryWeaponMode')}
          weapon={state.primaryWeapon}
          onWeaponChange={handleUpdate('primaryWeapon')}
          homebrewWeapon={state.homebrewPrimaryWeapon}
          onHomebrewChange={handleUpdate('homebrewPrimaryWeapon')}
          campaignId={campaignId}
        />
      )}

      {shouldShow('secondary') && (
        <SecondaryWeaponSection
          mode={state.secondaryWeaponMode}
          onModeChange={handleUpdate('secondaryWeaponMode')}
          weapon={state.secondaryWeapon}
          onWeaponChange={handleUpdate('secondaryWeapon')}
          homebrewWeapon={state.homebrewSecondaryWeapon}
          onHomebrewChange={handleUpdate('homebrewSecondaryWeapon')}
          campaignId={campaignId}
        />
      )}

      {shouldShow('armor') && (
        <ArmorSection
          mode={state.armorMode}
          onModeChange={handleUpdate('armorMode')}
          armor={state.armor}
          onArmorChange={handleUpdate('armor')}
          homebrewArmor={state.homebrewArmor}
          onHomebrewChange={handleUpdate('homebrewArmor')}
          campaignId={campaignId}
        />
      )}

      {shouldShow('wheelchair') && (
        <WheelchairSection
          enabled={state.useCombatWheelchair}
          onEnabledChange={handleUpdate('useCombatWheelchair')}
          mode={state.wheelchairMode}
          onModeChange={handleUpdate('wheelchairMode')}
          wheelchair={state.combatWheelchair}
          onWheelchairChange={handleUpdate('combatWheelchair')}
          homebrewWheelchair={state.homebrewWheelchair}
          onHomebrewChange={handleUpdate('homebrewWheelchair')}
          campaignId={campaignId}
        />
      )}

      {shouldShow('custom') && (
        <CustomEquipmentSection customSlots={state.customSlots ?? []} />
      )}
    </>
  );
}
