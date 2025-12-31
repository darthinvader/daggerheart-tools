import type { EquipmentState } from './equipment-editor';
import {
  ArmorSection,
  CustomEquipmentSection,
  PrimaryWeaponSection,
  SecondaryWeaponSection,
  WheelchairSection,
} from './sections';
import type { EditingSection } from './use-equipment-editor';

interface EditSectionContentProps {
  editingSection: EditingSection;
  draftEquipment: EquipmentState;
  updateDraft: (updates: Partial<EquipmentState>) => void;
  handleAddCustomSlot: () => void;
  hideDialogHeader?: boolean;
}

export function EditSectionContent({
  editingSection,
  draftEquipment,
  updateDraft,
  handleAddCustomSlot,
  hideDialogHeader,
}: EditSectionContentProps) {
  switch (editingSection) {
    case 'primary':
      return (
        <PrimaryWeaponSection
          mode={draftEquipment.primaryWeaponMode}
          onModeChange={mode => updateDraft({ primaryWeaponMode: mode })}
          weapon={draftEquipment.primaryWeapon}
          onWeaponChange={weapon => updateDraft({ primaryWeapon: weapon })}
          homebrewWeapon={draftEquipment.homebrewPrimaryWeapon}
          onHomebrewChange={v => updateDraft({ homebrewPrimaryWeapon: v })}
        />
      );
    case 'secondary':
      return (
        <SecondaryWeaponSection
          mode={draftEquipment.secondaryWeaponMode}
          onModeChange={mode => updateDraft({ secondaryWeaponMode: mode })}
          weapon={draftEquipment.secondaryWeapon}
          onWeaponChange={weapon => updateDraft({ secondaryWeapon: weapon })}
          homebrewWeapon={draftEquipment.homebrewSecondaryWeapon}
          onHomebrewChange={v => updateDraft({ homebrewSecondaryWeapon: v })}
        />
      );
    case 'armor':
      return (
        <ArmorSection
          mode={draftEquipment.armorMode}
          onModeChange={mode => updateDraft({ armorMode: mode })}
          armor={draftEquipment.armor}
          onArmorChange={armor => updateDraft({ armor })}
          homebrewArmor={draftEquipment.homebrewArmor}
          onHomebrewChange={v => updateDraft({ homebrewArmor: v })}
        />
      );
    case 'wheelchair':
      return (
        <WheelchairSection
          enabled={draftEquipment.useCombatWheelchair}
          onEnabledChange={v => updateDraft({ useCombatWheelchair: v })}
          mode={draftEquipment.wheelchairMode}
          onModeChange={mode => updateDraft({ wheelchairMode: mode })}
          wheelchair={draftEquipment.combatWheelchair}
          onWheelchairChange={chair => updateDraft({ combatWheelchair: chair })}
          homebrewWheelchair={draftEquipment.homebrewWheelchair}
          onHomebrewChange={v => updateDraft({ homebrewWheelchair: v })}
          hideTitle={hideDialogHeader}
        />
      );
    case 'custom':
      return (
        <CustomEquipmentSection
          slots={draftEquipment.customSlots ?? []}
          onAdd={handleAddCustomSlot}
          onUpdate={(id, eq) =>
            updateDraft({
              customSlots: (draftEquipment.customSlots ?? []).map(s =>
                s.id === id ? eq : s
              ),
            })
          }
          onDelete={id =>
            updateDraft({
              customSlots: (draftEquipment.customSlots ?? []).filter(
                s => s.id !== id
              ),
            })
          }
          hideTitle={hideDialogHeader}
        />
      );
    default:
      return null;
  }
}
