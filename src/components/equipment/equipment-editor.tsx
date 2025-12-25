import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type {
  CombatWheelchair,
  PrimaryWeapon,
  SecondaryWeapon,
  StandardArmor,
} from '@/lib/schemas/equipment';
import { generateId } from '@/lib/utils';

import type { CustomEquipment } from './custom-slot-editor';
import { EquipmentSummary } from './equipment-summary';
import {
  ArmorSection,
  CustomEquipmentSection,
  PrimaryWeaponSection,
  SecondaryWeaponSection,
  WheelchairSection,
} from './sections';

type EquipmentMode = 'standard' | 'homebrew';

export interface EquipmentState {
  primaryWeapon: PrimaryWeapon | null;
  primaryWeaponMode: EquipmentMode;
  homebrewPrimaryWeapon: Partial<PrimaryWeapon>;

  secondaryWeapon: SecondaryWeapon | null;
  secondaryWeaponMode: EquipmentMode;
  homebrewSecondaryWeapon: Partial<SecondaryWeapon>;

  armor: StandardArmor | null;
  armorMode: EquipmentMode;
  homebrewArmor: Partial<StandardArmor>;

  useCombatWheelchair: boolean;
  combatWheelchair: CombatWheelchair | null;
  wheelchairMode: EquipmentMode;
  homebrewWheelchair: Partial<CombatWheelchair>;

  customSlots: CustomEquipment[];
}

interface EquipmentEditorProps {
  value?: EquipmentState;
  onChange?: (value: EquipmentState) => void;
}

const DEFAULT_STATE: EquipmentState = {
  primaryWeapon: null,
  primaryWeaponMode: 'standard',
  homebrewPrimaryWeapon: { type: 'Primary', features: [] },

  secondaryWeapon: null,
  secondaryWeaponMode: 'standard',
  homebrewSecondaryWeapon: { type: 'Secondary', features: [] },

  armor: null,
  armorMode: 'standard',
  homebrewArmor: { features: [] },

  useCombatWheelchair: false,
  combatWheelchair: null,
  wheelchairMode: 'standard',
  homebrewWheelchair: {
    type: 'Primary',
    features: [],
    wheelchairFeatures: [],
    frameType: 'Light',
  },

  customSlots: [],
};

export function EquipmentEditor({ value, onChange }: EquipmentEditorProps) {
  const [internalState, setInternalState] =
    useState<EquipmentState>(DEFAULT_STATE);
  const state = value ?? internalState;

  const [primaryOpen, setPrimaryOpen] = useState(true);
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const [armorOpen, setArmorOpen] = useState(false);
  const [wheelchairOpen, setWheelchairOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);

  const updateState = (updates: Partial<EquipmentState>) => {
    const newState = { ...state, ...updates };
    if (onChange) {
      onChange(newState);
    } else {
      setInternalState(newState);
    }
  };

  const handleAddCustomSlot = () => {
    const newSlot: CustomEquipment = {
      id: generateId(),
      name: '',
      slotName: 'Ring',
      slotIcon: '💍',
      description: '',
      features: [],
    };
    updateState({ customSlots: [...state.customSlots, newSlot] });
    setCustomOpen(true);
  };

  return (
    <div className="space-y-4">
      <PrimaryWeaponSection
        isOpen={primaryOpen}
        onOpenChange={setPrimaryOpen}
        mode={state.primaryWeaponMode}
        onModeChange={v =>
          updateState({ primaryWeaponMode: v ? 'homebrew' : 'standard' })
        }
        weapon={state.primaryWeapon}
        onWeaponChange={weapon => updateState({ primaryWeapon: weapon })}
        homebrewWeapon={state.homebrewPrimaryWeapon}
        onHomebrewChange={v => updateState({ homebrewPrimaryWeapon: v })}
      />

      <SecondaryWeaponSection
        isOpen={secondaryOpen}
        onOpenChange={setSecondaryOpen}
        mode={state.secondaryWeaponMode}
        onModeChange={v =>
          updateState({ secondaryWeaponMode: v ? 'homebrew' : 'standard' })
        }
        weapon={state.secondaryWeapon}
        onWeaponChange={weapon => updateState({ secondaryWeapon: weapon })}
        homebrewWeapon={state.homebrewSecondaryWeapon}
        onHomebrewChange={v => updateState({ homebrewSecondaryWeapon: v })}
      />

      <ArmorSection
        isOpen={armorOpen}
        onOpenChange={setArmorOpen}
        mode={state.armorMode}
        onModeChange={v =>
          updateState({ armorMode: v ? 'homebrew' : 'standard' })
        }
        armor={state.armor}
        onArmorChange={armor => updateState({ armor })}
        homebrewArmor={state.homebrewArmor}
        onHomebrewChange={v => updateState({ homebrewArmor: v })}
      />

      <WheelchairSection
        isOpen={wheelchairOpen}
        onOpenChange={setWheelchairOpen}
        enabled={state.useCombatWheelchair}
        onEnabledChange={v => updateState({ useCombatWheelchair: v })}
        mode={state.wheelchairMode}
        onModeChange={v =>
          updateState({ wheelchairMode: v ? 'homebrew' : 'standard' })
        }
        wheelchair={state.combatWheelchair}
        onWheelchairChange={chair => updateState({ combatWheelchair: chair })}
        homebrewWheelchair={state.homebrewWheelchair}
        onHomebrewChange={v => updateState({ homebrewWheelchair: v })}
      />

      <CustomEquipmentSection
        isOpen={customOpen}
        onOpenChange={setCustomOpen}
        slots={state.customSlots}
        onAdd={handleAddCustomSlot}
        onUpdate={(id, eq) =>
          updateState({
            customSlots: state.customSlots.map(s => (s.id === id ? eq : s)),
          })
        }
        onDelete={id =>
          updateState({
            customSlots: state.customSlots.filter(s => s.id !== id),
          })
        }
      />

      <SummaryCard state={state} />
    </div>
  );
}

function SummaryCard({ state }: { state: EquipmentState }) {
  return (
    <Card className="bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          📋 Equipment Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EquipmentSummary
          primaryWeapon={state.primaryWeapon}
          primaryWeaponMode={state.primaryWeaponMode}
          homebrewPrimaryWeapon={state.homebrewPrimaryWeapon}
          secondaryWeapon={state.secondaryWeapon}
          secondaryWeaponMode={state.secondaryWeaponMode}
          homebrewSecondaryWeapon={state.homebrewSecondaryWeapon}
          armor={state.armor}
          armorMode={state.armorMode}
          homebrewArmor={state.homebrewArmor}
          useCombatWheelchair={state.useCombatWheelchair}
          combatWheelchair={state.combatWheelchair}
          wheelchairMode={state.wheelchairMode}
          homebrewWheelchair={state.homebrewWheelchair}
          customSlots={state.customSlots}
        />
      </CardContent>
    </Card>
  );
}
