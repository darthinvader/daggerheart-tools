import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
type EquipmentFilter =
  | 'all'
  | 'primary'
  | 'secondary'
  | 'armor'
  | 'wheelchair'
  | 'custom';

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

export const DEFAULT_EQUIPMENT_STATE = DEFAULT_STATE;

export function EquipmentEditor({ value, onChange }: EquipmentEditorProps) {
  const [internalState, setInternalState] =
    useState<EquipmentState>(DEFAULT_STATE);
  const state = value ?? internalState;

  const [filter, setFilter] = useState<EquipmentFilter>('all');
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

  const handleFilterChange = (value: string) => {
    const newFilter = (value || 'all') as EquipmentFilter;
    setFilter(newFilter);
    if (newFilter === 'primary') setPrimaryOpen(true);
    if (newFilter === 'secondary') setSecondaryOpen(true);
    if (newFilter === 'armor') setArmorOpen(true);
    if (newFilter === 'wheelchair') setWheelchairOpen(true);
    if (newFilter === 'custom') setCustomOpen(true);
  };

  const showPrimary = filter === 'all' || filter === 'primary';
  const showSecondary = filter === 'all' || filter === 'secondary';
  const showArmor = filter === 'all' || filter === 'armor';
  const showWheelchair = filter === 'all' || filter === 'wheelchair';
  const showCustom = filter === 'all' || filter === 'custom';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">Filter:</span>
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={handleFilterChange}
          className="flex-wrap"
        >
          <ToggleGroupItem value="all" size="sm">
            All
          </ToggleGroupItem>
          <ToggleGroupItem value="primary" size="sm" className="gap-1">
            ⚔️ Primary
            {state.primaryWeapon && (
              <Badge variant="secondary" className="size-2 p-0" />
            )}
          </ToggleGroupItem>
          <ToggleGroupItem value="secondary" size="sm" className="gap-1">
            🗡️ Secondary
            {state.secondaryWeapon && (
              <Badge variant="secondary" className="size-2 p-0" />
            )}
          </ToggleGroupItem>
          <ToggleGroupItem value="armor" size="sm" className="gap-1">
            🛡️ Armor
            {state.armor && (
              <Badge variant="secondary" className="size-2 p-0" />
            )}
          </ToggleGroupItem>
          <ToggleGroupItem value="wheelchair" size="sm" className="gap-1">
            ♿ Wheelchair
            {state.useCombatWheelchair && (
              <Badge variant="secondary" className="size-2 p-0" />
            )}
          </ToggleGroupItem>
          <ToggleGroupItem value="custom" size="sm" className="gap-1">
            ✨ Custom
            {state.customSlots.length > 0 && (
              <Badge variant="secondary" className="px-1 text-xs">
                {state.customSlots.length}
              </Badge>
            )}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {showPrimary && (
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
      )}

      {showSecondary && (
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
      )}

      {showArmor && (
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
      )}

      {showWheelchair && (
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
      )}

      {showCustom && (
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
      )}

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
