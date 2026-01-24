import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from '@/lib/icons';
import type {
  CombatWheelchair,
  PrimaryWeapon,
  SecondaryWeapon,
  StandardArmor,
} from '@/lib/schemas/equipment';

import { DEFAULT_EQUIPMENT_STATE } from './constants';
import type { CustomEquipment } from './custom-slot-editor';
import { EquipmentEditorSections } from './equipment-editor-sections';
import {
  type EquipmentFilter,
  EquipmentFilterBar,
} from './equipment-filter-bar';
import { EquipmentSummary } from './equipment-summary';

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

export function EquipmentEditor({ value, onChange }: EquipmentEditorProps) {
  const [internalState, setInternalState] = useState<EquipmentState>(
    DEFAULT_EQUIPMENT_STATE
  );
  const state = value ?? internalState;
  const [filter, setFilter] = useState<EquipmentFilter>('all');

  const updateState = (updates: Partial<EquipmentState>) => {
    const newState = { ...state, ...updates };
    if (onChange) {
      onChange(newState);
    } else {
      setInternalState(newState);
    }
  };

  return (
    <div className="space-y-4">
      <EquipmentFilterBar
        filter={filter}
        onFilterChange={setFilter}
        state={state}
      />

      <EquipmentEditorSections
        filter={filter}
        state={state}
        updateState={updateState}
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
          <ClipboardList className="size-5" /> Equipment Summary
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
          customSlots={state.customSlots ?? []}
        />
      </CardContent>
    </Card>
  );
}
