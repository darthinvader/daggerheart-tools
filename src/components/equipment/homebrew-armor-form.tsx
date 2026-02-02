/**
 * Homebrew Armor Form - Character Page Wrapper
 *
 * Thin wrapper that uses the unified EquipmentForm from the homebrew module.
 * Adapts between the character page's armor type and EquipmentForm's data type.
 */
import { useMemo } from 'react';

import { EquipmentForm, type EquipmentFormData } from '@/components/homebrew';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StandardArmor } from '@/lib/schemas/equipment';

type ArmorFormData = Omit<StandardArmor, 'metadata' | 'isStandard'>;

interface HomebrewArmorFormProps {
  value: Partial<ArmorFormData>;
  onChange: (value: Partial<ArmorFormData>) => void;
}

/** Convert ArmorFormData to EquipmentFormData */
function armorToEquipmentFormData(
  value: Partial<ArmorFormData>
): EquipmentFormData {
  return {
    equipmentType: 'armor',
    name: value.name ?? '',
    tier: value.tier ?? '1',
    armorType: value.armorType ?? 'Leather',
    baseScore: value.baseScore ?? 3,
    baseThresholds: value.baseThresholds ?? { major: 5, severe: 11 },
    evasionModifier: value.evasionModifier ?? 0,
    agilityModifier: value.agilityModifier ?? 0,
    features: value.features ?? [],
    description: value.description,
    statModifiers: value.statModifiers,
    isHomebrew: true,
  };
}

/** Convert EquipmentFormData back to ArmorFormData */
function equipmentFormDataToArmor(
  data: EquipmentFormData
): Partial<ArmorFormData> {
  if (data.equipmentType !== 'armor') return {};
  return {
    name: data.name,
    tier: data.tier,
    armorType: data.armorType,
    baseScore: data.baseScore,
    baseThresholds: data.baseThresholds,
    evasionModifier: data.evasionModifier,
    agilityModifier: data.agilityModifier,
    features: data.features,
    description: data.description,
    statModifiers: data.statModifiers,
  };
}

export function HomebrewArmorForm({ value, onChange }: HomebrewArmorFormProps) {
  const initialData = useMemo(
    () => armorToEquipmentFormData(value),
    // Only recompute on initial mount, not on every value change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleChange = (data: EquipmentFormData) => {
    onChange(equipmentFormDataToArmor(data));
  };

  return (
    <Card className="border-primary/50 border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge>🛡️ Homebrew</Badge>
          <CardTitle className="text-base">Custom Armor</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <EquipmentForm
          initialData={initialData}
          onChange={handleChange}
          showActions={false}
          lockedType="armor"
          compact
        />
      </CardContent>
    </Card>
  );
}
