import { useState } from 'react';

import { EquipmentDisplay, type EquipmentState } from '@/components/equipment';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SAMPLE_EQUIPPED: EquipmentState = {
  primaryWeapon: {
    name: 'Longsword',
    type: 'Primary',
    trait: 'Blade',
    range: 'Melee',
    damage: { diceType: 8, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    tier: '1',
    features: [],
    metadata: { source: 'SRD' },
  },
  primaryWeaponMode: 'standard',
  homebrewPrimaryWeapon: { type: 'Primary', features: [] },

  secondaryWeapon: {
    name: 'Shortbow',
    type: 'Secondary',
    trait: 'Ranged',
    range: 'Far',
    damage: { diceType: 6, count: 1, modifier: 0, type: 'phy' },
    burden: 'Two-Handed',
    tier: '1',
    features: [],
    metadata: { source: 'SRD' },
  },
  secondaryWeaponMode: 'standard',
  homebrewSecondaryWeapon: { type: 'Secondary', features: [] },

  armor: {
    name: 'Chainmail',
    tier: '2',
    armorType: 'Chainmail',
    isStandard: true,
    baseThresholds: { major: 5, severe: 9 },
    baseScore: 3,
    evasionModifier: -1,
    agilityModifier: 0,
    features: [],
    metadata: { source: 'SRD' },
  },
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

const SAMPLE_MINIMAL: EquipmentState = {
  primaryWeapon: {
    name: 'Dagger',
    type: 'Primary',
    trait: 'Blade',
    range: 'Melee',
    damage: { diceType: 4, count: 1, modifier: 0, type: 'phy' },
    burden: 'One-Handed',
    tier: '1',
    features: [],
    metadata: { source: 'SRD' },
  },
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

const SAMPLE_EMPTY: EquipmentState = {
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

export function EquipmentDisplayDemo() {
  const [fullyEquipped, setFullyEquipped] =
    useState<EquipmentState>(SAMPLE_EQUIPPED);
  const [minimalEquipped, setMinimalEquipped] =
    useState<EquipmentState>(SAMPLE_MINIMAL);
  const [emptyEquipment, setEmptyEquipment] =
    useState<EquipmentState>(SAMPLE_EMPTY);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold">🛡️ Equipment Display Demo</h2>
        <p className="text-muted-foreground">
          Showcases the EquipmentDisplay component with edit modal capability.
          Click the Edit button to modify equipment loadouts.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-red-500/30 bg-red-500/10 text-red-600"
              >
                ⚔️ Fully Equipped
              </Badge>
              <span className="text-muted-foreground font-normal">
                Weapons + Armor
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <EquipmentDisplay
              equipment={fullyEquipped}
              onChange={setFullyEquipped}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge
                variant="secondary"
                className="border-amber-500/30 bg-amber-500/10 text-amber-600"
              >
                🗡️ Minimal
              </Badge>
              <span className="text-muted-foreground font-normal">
                Just a dagger
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <EquipmentDisplay
              equipment={minimalEquipped}
              onChange={setMinimalEquipped}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Badge variant="outline">Empty State</Badge>
              <span className="text-muted-foreground font-normal">
                No equipment
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <EquipmentDisplay
              equipment={emptyEquipment}
              onChange={setEmptyEquipment}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
